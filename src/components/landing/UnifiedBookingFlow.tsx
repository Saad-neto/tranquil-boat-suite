import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  Calendar as CalendarIcon,
  Users,
  UtensilsCrossed,
  Check,
  Percent,
  CreditCard,
  QrCode,
  ArrowRight,
  CheckCircle2,
  Loader2,
  Mail,
  Phone,
  User
} from 'lucide-react';
import { tours, kitTranquilidade } from '@/data/tours';
import { shouldDisableDate, MAX_BOOKING_DATE } from '@/data/availability';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { createPublicBooking } from '@/services/bookingService';
import { CheckoutPixPayment } from '@/components/checkout/CheckoutPixPayment';
import { CheckoutCardPayment } from '@/components/checkout/CheckoutCardPayment';
import type { PaymentMethod } from '@/types/checkout';
import { trackLeadSubmit } from '@/lib/analytics';
import { captureLead } from '@/services/leadService';

// Schema de validação
const bookingFormSchema = z.object({
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  email: z.string().email('Email inválido'),
  phone: z.string().min(10, 'Telefone inválido').regex(/^[\d\s()+\-]+$/, 'Telefone inválido'),
  date: z.date({ required_error: 'Selecione uma data' }),
  numberOfPeople: z.coerce.number().min(1).max(7).optional(),
  kitQuantity: z.coerce.number().min(0).max(2).default(0),
  notes: z.string().optional(),
});

type BookingFormValues = z.infer<typeof bookingFormSchema>;

type Step = 'form' | 'payment-method' | 'payment-process' | 'confirmation';

export default function UnifiedBookingFlow() {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState<Step>('form');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [bookingNumber, setBookingNumber] = useState<string | null>(null);
  const [isCreatingBooking, setIsCreatingBooking] = useState(false);

  // Progressive disclosure states
  const [showEmailField, setShowEmailField] = useState(false);
  const [showPhoneField, setShowPhoneField] = useState(false);
  const [showDateField, setShowDateField] = useState(false);
  const [showPeopleField, setShowPeopleField] = useState(false);
  const [showKitField, setShowKitField] = useState(false);
  const [showNotesField, setShowNotesField] = useState(false);

  // Calendar popover state
  const [calendarOpen, setCalendarOpen] = useState(false);

  // Field validation states (for checkmarks)
  const [validFields, setValidFields] = useState<Record<string, boolean>>({
    name: false,
    email: false,
    phone: false,
    date: false,
  });

  const tour = tours[0]; // Passeio único

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      numberOfPeople: undefined,
      kitQuantity: 0,
      notes: '',
    },
  });

  const kitQuantity = form.watch('kitQuantity');
  const watchedValues = form.watch();

  // Progressive disclosure logic
  useEffect(() => {
    const { name, email, phone, date } = watchedValues;

    // Validate and show next fields progressively
    const nameValid = name && name.length >= 3;
    // Email validation: more strict - requires complete domain and extension
    const emailValid = email &&
                      email.length >= 6 &&
                      /^[^\s@]+@[^\s@]{2,}\.[^\s@]{2,}$/.test(email);
    const phoneValid = phone && phone.length >= 10;
    const dateValid = !!date;

    setValidFields({
      name: !!nameValid,
      email: !!emailValid,
      phone: !!phoneValid,
      date: !!dateValid,
    });

    // Progressive disclosure - instant reveal (no delays)
    if (nameValid && !showEmailField) {
      setShowEmailField(true);
    }
    if (nameValid && emailValid && !showPhoneField) {
      setShowPhoneField(true);
    }
    if (nameValid && emailValid && phoneValid && !showDateField) {
      setShowDateField(true);
      setShowPeopleField(true);
    }
    if (nameValid && emailValid && phoneValid && dateValid && !showKitField) {
      setShowKitField(true);
      setShowNotesField(true);
    }
  }, [watchedValues, showEmailField, showPhoneField, showDateField, showKitField]);

  // Cálculo do valor total
  const basePrice = tour.price;
  const kitUnitPrice = kitTranquilidade.price;
  const kitSubtotal = kitQuantity * kitUnitPrice;
  const kitDiscount = kitQuantity === 2 ? 200 : 0;
  const kitFinalPrice = kitSubtotal - kitDiscount;
  const totalPrice = basePrice + kitFinalPrice;
  const installmentPrice = (totalPrice * 1.15 / 12).toFixed(2).replace('.', ',');

  // Submissão do form (Passo 1 → Passo 2)
  const onSubmit = async (data: BookingFormValues) => {
    // Validar e ir para seleção de método de pagamento
    setCurrentStep('payment-method');

    // Scroll suave para a próxima seção
    setTimeout(() => {
      document.getElementById('payment-method-section')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }, 100);
  };

  // Seleção de método de pagamento e criação da reserva
  const handleSelectPaymentMethod = async (method: PaymentMethod) => {
    setPaymentMethod(method);
    setIsCreatingBooking(true);

    try {
      const formData = form.getValues();

      // Criar reserva no banco AGORA (antes do pagamento)
      const response = await createPublicBooking({
        customerName: formData.name,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        date: formData.date.toISOString(),
        numberOfPeople: formData.numberOfPeople,
        notes: formData.notes,
        tourName: tour.name,
        totalPrice: totalPrice,
        kitQuantity: kitQuantity,
      });

      setBookingId(response.data.id);
      setBookingNumber(response.data.bookingNumber);
      setCurrentStep('payment-process');

      // 🎯 NOVO: Rastrear Lead no GA4/Google Ads
      trackLeadSubmit('booking_form', totalPrice);

      // 🎯 NOVO: Capturar Lead no CRM (já existia no antigo BookingForm)
      try {
        await captureLead({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          desiredDate: formData.date.toISOString(),
          numberOfPeople: formData.numberOfPeople,
          notes: formData.notes,
          tourName: tour.name,
        });
      } catch (error) {
        console.error('Erro ao capturar lead:', error);
        // Não bloqueia o fluxo
      }

      toast({
        title: 'Reserva criada!',
        description: `Número da reserva: ${response.data.bookingNumber}`,
      });

      // Scroll para o form de pagamento
      setTimeout(() => {
        document.getElementById('payment-form-section')?.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }, 100);

    } catch (error) {
      console.error('Erro ao criar reserva:', error);
      toast({
        title: 'Erro ao criar reserva',
        description: error instanceof Error ? error.message : 'Tente novamente',
        variant: 'destructive',
      });
    } finally {
      setIsCreatingBooking(false);
    }
  };

  // Pagamento concluído
  const handlePaymentCreated = () => {
    setCurrentStep('confirmation');

    setTimeout(() => {
      document.getElementById('confirmation-section')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }, 100);
  };

  // Calculate progress percentage
  const progressSteps = [
    { key: 'name', label: 'Nome', completed: validFields.name },
    { key: 'email', label: 'Email', completed: validFields.email },
    { key: 'phone', label: 'WhatsApp', completed: validFields.phone },
    { key: 'date', label: 'Data', completed: validFields.date },
  ];
  const completedSteps = progressSteps.filter(s => s.completed).length;
  const progressPercentage = (completedSteps / progressSteps.length) * 100;

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      {/* Coluna Principal - Formulário */}
      <div className="lg:col-span-2 space-y-6 md:space-y-8 pb-24 md:pb-0">
        {/* Resumo Compacto Mobile */}
        {currentStep === 'form' && (
          <Card className="lg:hidden">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <UtensilsCrossed className="w-5 h-5 text-primary" />
                  <div>
                    <h4 className="font-semibold text-sm">{tour.name}</h4>
                    {watchedValues.date && (
                      <p className="text-xs text-muted-foreground">
                        {format(watchedValues.date, "dd/MM/yyyy")}
                      </p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg text-accent">
                    R$ {totalPrice.toLocaleString('pt-BR')}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    12x R$ {installmentPrice}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Indicador de Progresso */}
        {currentStep === 'form' && (
          <div className="bg-white rounded-lg p-4 md:p-5 shadow-sm border">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs md:text-sm font-medium text-muted-foreground">
                {completedSteps === 0 && 'Preencha os dados básicos'}
                {completedSteps > 0 && completedSteps < 4 && `${completedSteps}/4 campos preenchidos`}
                {completedSteps === 4 && '✓ Pronto para continuar!'}
              </h4>
              <span className="text-xs md:text-sm font-semibold text-primary">{Math.round(progressPercentage)}%</span>
            </div>
            <div className="h-2 md:h-2.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500 ease-out"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <div className="flex gap-1 md:gap-2 mt-3">
              {progressSteps.map((step, idx) => (
                <div
                  key={step.key}
                  className={cn(
                    "flex-1 text-center text-[10px] md:text-xs py-1 md:py-1.5 rounded transition-all duration-300",
                    step.completed ? "bg-green-100 text-green-700 font-medium" : "bg-gray-50 text-gray-400"
                  )}
                >
                  <span className="hidden md:inline">{step.completed ? '✓ ' : ''}</span>{step.label}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Passo 1: Formulário de Dados */}
        <Card id="booking-form-section">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-6">
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center font-semibold transition-all duration-300",
                currentStep === 'form' ? "bg-primary text-white" : "bg-green-500 text-white scale-110"
              )}>
                {currentStep === 'form' ? '1' : <Check className="w-5 h-5" />}
              </div>
              <h3 className="text-xl font-semibold">Dados da Reserva</h3>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Primeira linha: Nome e Email */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Nome */}
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="transition-all duration-300 animate-fade-up">
                        <FormLabel className="flex items-center gap-2">
                          <User className="w-4 h-4 text-muted-foreground" />
                          Nome Completo *
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              placeholder="Nome Completo"
                              {...field}
                              disabled={currentStep !== 'form'}
                              className={cn(
                                "transition-all duration-300 h-12 md:h-10 text-base",
                                validFields.name && "pr-10 border-green-500 focus:border-green-500"
                              )}
                            />
                            {validFields.name && (
                              <div className="absolute right-3 top-3 text-green-500 animate-scale-in">
                                <CheckCircle2 className="w-5 h-5" />
                              </div>
                            )}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Email - Progressive Disclosure (aparece quando nome válido) */}
                  {showEmailField && (
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem className="transition-all duration-300 animate-fade-up">
                          <FormLabel className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-muted-foreground" />
                            Email *
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type="email"
                                inputMode="email"
                                autoComplete="email"
                                placeholder="Email"
                                {...field}
                                disabled={currentStep !== 'form'}
                                className={cn(
                                  "transition-all duration-300 h-12 md:h-10 text-base",
                                  validFields.email && "pr-10 border-green-500 focus:border-green-500"
                                )}
                              />
                              {validFields.email && (
                                <div className="absolute right-3 top-3 text-green-500 animate-scale-in">
                                  <CheckCircle2 className="w-5 h-5" />
                                </div>
                              )}
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>

                {/* Segunda linha: WhatsApp e Pessoas */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* WhatsApp - Progressive Disclosure (aparece quando email válido) */}
                  {showPhoneField && (
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem className="transition-all duration-300 animate-fade-up">
                          <FormLabel className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-muted-foreground" />
                            WhatsApp *
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type="tel"
                                inputMode="tel"
                                autoComplete="tel"
                                placeholder="WhatsApp"
                                {...field}
                                disabled={currentStep !== 'form'}
                                className={cn(
                                  "transition-all duration-300 h-12 md:h-10 text-base",
                                  validFields.phone && "pr-10 border-green-500 focus:border-green-500"
                                )}
                              />
                              {validFields.phone && (
                                <div className="absolute right-3 top-3 text-green-500 animate-scale-in">
                                  <CheckCircle2 className="w-5 h-5" />
                                </div>
                              )}
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  {/* Número de Pessoas - Progressive Disclosure */}
                  {showPeopleField && (
                    <FormField
                      control={form.control}
                      name="numberOfPeople"
                      render={({ field }) => (
                        <FormItem className="transition-all duration-300 animate-fade-up">
                          <FormLabel>Número de Pessoas (opcional)</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Users className="absolute left-3 top-4 md:top-3 h-4 w-4 text-muted-foreground" />
                              <Input
                                type="number"
                                inputMode="numeric"
                                min="1"
                                max="7"
                                className="pl-10 transition-all duration-300 h-12 md:h-10 text-base"
                                {...field}
                                disabled={currentStep !== 'form'}
                              />
                            </div>
                          </FormControl>
                          <FormDescription>Máximo 7 pessoas por barco</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>

                {/* Data - Progressive Disclosure (largura total) */}
                {showDateField && (
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col transition-all duration-300 animate-fade-up">
                          <FormLabel className="flex items-center gap-2">
                            <CalendarIcon className="w-4 h-4 text-muted-foreground" />
                            Data Desejada *
                          </FormLabel>
                          <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  disabled={currentStep !== 'form'}
                                  className={cn(
                                    'w-full pl-3 text-left font-normal transition-all duration-300',
                                    'h-12 md:h-10 text-base touch-manipulation',
                                    !field.value && 'text-muted-foreground',
                                    validFields.date && 'border-green-500 hover:border-green-500'
                                  )}
                                >
                                  <div className="flex items-center justify-between w-full">
                                    {field.value ? (
                                      format(field.value, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
                                    ) : (
                                      <span>Selecione uma data</span>
                                    )}
                                    <div className="flex items-center gap-2">
                                      {validFields.date && (
                                        <CheckCircle2 className="w-4 h-4 text-green-500 animate-scale-in" />
                                      )}
                                      <CalendarIcon className="h-4 w-4 opacity-50" />
                                    </div>
                                  </div>
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={(date) => {
                                  field.onChange(date);
                                  setCalendarOpen(false); // Fecha o calendário após selecionar
                                }}
                                disabled={shouldDisableDate}
                                initialFocus
                                locale={ptBR}
                                toDate={MAX_BOOKING_DATE}
                              />
                            </PopoverContent>
                          </Popover>
                          <FormDescription>
                            Reservas disponíveis até 01/03/2026. Datas em cinza estão ocupadas.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                {/* Kit Tranquilidade - Progressive Disclosure */}
                {showKitField && (
                  <div className="border rounded-lg p-4 bg-muted/30 transition-all duration-300 animate-fade-up">
                    <FormField
                      control={form.control}
                      name="kitQuantity"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center justify-between mb-3">
                            <FormLabel className="text-base flex items-center gap-2">
                              <UtensilsCrossed className="w-5 h-5 text-primary" />
                              Kit Tranquilidade
                              <span className="text-accent font-bold">R$ {kitTranquilidade.price}/kit</span>
                            </FormLabel>
                            {kitQuantity === 2 && (
                              <Badge className="bg-success text-success-foreground gap-1 animate-scale-in">
                                <Percent className="w-3 h-3" />
                                2º kit por R$ 200
                              </Badge>
                            )}
                          </div>
                          <FormDescription className="text-sm mb-3">
                            Inclui: {kitTranquilidade.items.map(item => item.name).join(', ')}
                          </FormDescription>
                          <FormControl>
                            <div className="flex gap-2">
                              {[0, 1, 2].map((qty) => (
                                <Button
                                  key={qty}
                                  type="button"
                                  variant={field.value === qty ? "default" : "outline"}
                                  className="flex-1 transition-all duration-300 h-12 md:h-10 touch-manipulation"
                                  onClick={() => field.onChange(qty)}
                                  disabled={currentStep !== 'form'}
                                >
                                  <span className="text-sm md:text-base">
                                    {qty === 0 ? 'Sem kit' : `${qty} kit${qty > 1 ? 's' : ''}`}
                                  </span>
                                  {qty === 2 && <span className="ml-1 text-xs hidden md:inline">(2º por R$ 200)</span>}
                                </Button>
                              ))}
                            </div>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                {/* Observações - Progressive Disclosure */}
                {showNotesField && (
                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem className="transition-all duration-300 animate-fade-up">
                        <FormLabel>Observações (Opcional)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Alguma informação adicional ou solicitação especial?"
                            className="resize-none transition-all duration-300 text-base min-h-[100px] md:min-h-[80px]"
                            rows={3}
                            {...field}
                            disabled={currentStep !== 'form'}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {/* Botão de Continuar - Desktop */}
                {currentStep === 'form' && (
                  <div className="space-y-3 hidden md:block">
                    {completedSteps === 4 && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center animate-fade-up">
                        <p className="text-sm text-green-700 font-medium">
                          ✓ Ótimo! Todos os campos obrigatórios preenchidos
                        </p>
                      </div>
                    )}
                    <Button
                      type="submit"
                      size="lg"
                      className={cn(
                        "w-full transition-all duration-300 h-12",
                        completedSteps === 4 && "shadow-lg shadow-primary/30 scale-[1.02]"
                      )}
                      disabled={completedSteps < 4}
                    >
                      Ver Opções de Pagamento
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </div>
                )}

                {/* Botão de Continuar - Mobile (Sticky Bottom) */}
                {currentStep === 'form' && (
                  <div className="md:hidden">
                    {completedSteps === 4 && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center animate-fade-up mb-20">
                        <p className="text-sm text-green-700 font-medium">
                          ✓ Ótimo! Todos os campos obrigatórios preenchidos
                        </p>
                      </div>
                    )}
                    <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t shadow-lg z-50">
                      <Button
                        type="submit"
                        size="lg"
                        className={cn(
                          "w-full transition-all duration-300 h-14 text-base",
                          completedSteps === 4 && "shadow-lg shadow-primary/30"
                        )}
                        disabled={completedSteps < 4}
                      >
                        Ver Opções de Pagamento
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                )}
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Passo 2: Seleção de Método de Pagamento */}
        {currentStep !== 'form' && (
          <Card id="payment-method-section">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-6">
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center font-semibold",
                  currentStep === 'payment-method' ? "bg-primary text-white" : "bg-green-500 text-white"
                )}>
                  {currentStep === 'payment-method' ? '2' : <Check className="w-5 h-5" />}
                </div>
                <h3 className="text-xl font-semibold">Forma de Pagamento</h3>
              </div>

              {currentStep === 'payment-method' && (
                <div className="grid md:grid-cols-2 gap-4">
                  {/* PIX */}
                  <button
                    onClick={() => handleSelectPaymentMethod('PIX')}
                    disabled={isCreatingBooking}
                    className={cn(
                      "p-6 md:p-8 border-2 rounded-lg transition-all duration-300 min-h-[160px]",
                      "hover:border-primary hover:shadow-lg hover:scale-[1.02]",
                      "flex flex-col items-center justify-center gap-3 text-center",
                      "animate-fade-up touch-manipulation",
                      paymentMethod === 'PIX' && "border-primary bg-primary/5 shadow-lg scale-[1.02]"
                    )}
                  >
                    <QrCode className={cn(
                      "w-12 h-12 text-primary transition-transform duration-300",
                      paymentMethod === 'PIX' && "scale-110"
                    )} />
                    <div>
                      <h4 className="font-semibold text-lg">PIX</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Aprovação instantânea
                      </p>
                      <div className="flex items-center justify-center gap-1 text-xs text-green-600 mt-2 font-medium">
                        <CheckCircle2 className="w-3 h-3" />
                        Confirmação em segundos
                      </div>
                    </div>
                  </button>

                  {/* Cartão */}
                  <button
                    onClick={() => handleSelectPaymentMethod('CREDIT_CARD')}
                    disabled={isCreatingBooking}
                    className={cn(
                      "p-6 md:p-8 border-2 rounded-lg transition-all duration-300 min-h-[160px]",
                      "hover:border-primary hover:shadow-lg hover:scale-[1.02]",
                      "flex flex-col items-center justify-center gap-3 text-center",
                      "animate-fade-up touch-manipulation",
                      paymentMethod === 'CREDIT_CARD' && "border-primary bg-primary/5 shadow-lg scale-[1.02]"
                    )}
                    style={{ animationDelay: '0.1s' }}
                  >
                    <CreditCard className={cn(
                      "w-12 h-12 text-primary transition-transform duration-300",
                      paymentMethod === 'CREDIT_CARD' && "scale-110"
                    )} />
                    <div>
                      <h4 className="font-semibold text-lg">Cartão de Crédito</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Parcele em até 12x
                      </p>
                      <div className="flex items-center justify-center gap-1 text-xs text-blue-600 mt-2 font-medium">
                        <CheckCircle2 className="w-3 h-3" />
                        Aprovação automática
                      </div>
                    </div>
                  </button>
                </div>
              )}

              {isCreatingBooking && (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  <span className="ml-3">Criando sua reserva...</span>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Passo 3: Formulário de Pagamento */}
        {currentStep === 'payment-process' && bookingId && bookingNumber && (
          <Card id="payment-form-section">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-semibold">
                    3
                  </div>
                  <h3 className="text-xl font-semibold">Realizar Pagamento</h3>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setCurrentStep('form');
                    setBookingId(null);
                    setBookingNumber(null);
                  }}
                  className="flex items-center gap-2"
                >
                  <ArrowRight className="w-4 h-4 rotate-180" />
                  Editar dados
                </Button>
              </div>

              {/* Resumo da Reserva */}
              <div className="mb-6 p-4 bg-muted/50 rounded-lg border">
                <h4 className="font-semibold mb-3">Resumo da Reserva</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Nome:</span>
                    <span className="font-medium">{watchedValues.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Email:</span>
                    <span className="font-medium">{watchedValues.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">WhatsApp:</span>
                    <span className="font-medium">{watchedValues.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Data:</span>
                    <span className="font-medium">
                      {watchedValues.date ? format(watchedValues.date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR }) : '-'}
                    </span>
                  </div>
                  {watchedValues.numberOfPeople && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Pessoas:</span>
                      <span className="font-medium">{watchedValues.numberOfPeople}</span>
                    </div>
                  )}
                  {kitQuantity > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Kit Tranquilidade:</span>
                      <span className="font-medium">{kitQuantity}x</span>
                    </div>
                  )}
                  <div className="flex justify-between pt-2 border-t">
                    <span className="text-muted-foreground font-semibold">Valor Total:</span>
                    <span className="font-bold text-lg text-primary">
                      R$ {totalPrice.toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                </div>
              </div>

              {paymentMethod === 'PIX' && (
                <CheckoutPixPayment
                  bookingId={bookingId}
                  bookingNumber={bookingNumber}
                  totalAmount={totalPrice}
                  customerName={watchedValues.name}
                  customerEmail={watchedValues.email}
                  customerPhone={watchedValues.phone}
                  onPaymentCreated={handlePaymentCreated}
                />
              )}

              {paymentMethod === 'CREDIT_CARD' && (
                <CheckoutCardPayment
                  bookingId={bookingId}
                  bookingNumber={bookingNumber}
                  totalAmount={totalPrice}
                  customerName={watchedValues.name}
                  customerEmail={watchedValues.email}
                  customerPhone={watchedValues.phone}
                  onPaymentCreated={handlePaymentCreated}
                />
              )}
            </CardContent>
          </Card>
        )}

        {/* Passo 4: Confirmação */}
        {currentStep === 'confirmation' && (
          <Card id="confirmation-section" className="border-green-500">
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">Reserva Confirmada!</h3>
                <p className="text-muted-foreground mb-4">
                  Número da reserva: <strong>{bookingNumber}</strong>
                </p>
                <p className="text-sm text-muted-foreground">
                  Você receberá as instruções por WhatsApp em breve.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Coluna Lateral - Resumo Sticky (Desktop only) */}
      <div className="hidden lg:block lg:col-span-1">
        <div className="sticky top-24">
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold text-lg mb-4">Resumo da Reserva</h3>

              {/* Passeio */}
              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Passeio</span>
                  <span className="font-medium">{tour.name}</span>
                </div>
                {watchedValues.date && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Data</span>
                    <span className="font-medium">
                      {format(watchedValues.date, "dd/MM/yyyy")}
                    </span>
                  </div>
                )}
                {watchedValues.numberOfPeople && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Pessoas</span>
                    <span className="font-medium">{watchedValues.numberOfPeople}</span>
                  </div>
                )}
              </div>

              <div className="border-t pt-3 mb-3">
                <div className="flex justify-between text-sm mb-2">
                  <span>Passeio</span>
                  <span className="font-medium">R$ {basePrice.toLocaleString('pt-BR')}</span>
                </div>
                {kitQuantity > 0 && (
                  <>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Kit Tranquilidade ({kitQuantity}x)</span>
                      <span className="font-medium">R$ {kitSubtotal.toLocaleString('pt-BR')}</span>
                    </div>
                    {kitDiscount > 0 && (
                      <div className="flex justify-between text-sm text-success mb-2">
                        <span>Desconto (2º kit)</span>
                        <span>- R$ {kitDiscount.toLocaleString('pt-BR')}</span>
                      </div>
                    )}
                  </>
                )}
              </div>

              <div className="border-t pt-3">
                <div className="flex justify-between font-bold text-lg mb-1">
                  <span>Total</span>
                  <span className="text-accent transition-all duration-300 animate-scale-in">
                    R$ {totalPrice.toLocaleString('pt-BR')}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground text-right">
                  ou 12x de R$ {installmentPrice}*
                </p>
              </div>

              {/* Trust badges */}
              <div className="mt-6 pt-6 border-t space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground transition-all duration-300 hover:text-foreground">
                  <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span>Reembolso integral por clima</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
