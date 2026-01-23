import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import { Calendar as CalendarIcon, Users, Send, UtensilsCrossed, Check, Percent } from 'lucide-react';
import { tours, kitTranquilidade } from '@/data/tours';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

// Schema de validação com Zod
const bookingFormSchema = z.object({
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  email: z.string().email('Email inválido'),
  phone: z
    .string()
    .min(10, 'Telefone inválido')
    .regex(/^[\d\s()+\-]+$/, 'Telefone deve conter apenas números e símbolos válidos'),
  date: z.date({
    required_error: 'Selecione uma data',
  }),
  numberOfPeople: z.coerce
    .number()
    .min(1, 'Mínimo 1 pessoa')
    .max(7, 'Máximo 7 pessoas')
    .optional(),
  kitQuantity: z.coerce.number().min(0).max(2).default(0),
  notes: z.string().optional(),
});

type BookingFormValues = z.infer<typeof bookingFormSchema>;

const BookingForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  // Cálculo do valor total
  const basePrice = tour.price;
  const kitUnitPrice = kitTranquilidade.price;
  const kitSubtotal = kitQuantity * kitUnitPrice;
  const kitDiscount = kitQuantity === 2 ? kitSubtotal * 0.10 : 0; // 10% desconto para 2 kits
  const kitFinalPrice = kitSubtotal - kitDiscount;
  const totalPrice = basePrice + kitFinalPrice;
  const installmentPrice = (totalPrice * 1.15 / 12).toFixed(2).replace('.', ','); // Juros de 15% em 12x

  const onSubmit = async (data: BookingFormValues) => {
    setIsSubmitting(true);

    try {
      // Navigate to checkout with booking data
      navigate('/checkout', {
        state: {
          bookingData: {
            customerName: data.name,
            customerEmail: data.email,
            customerPhone: data.phone,
            date: data.date,
            numberOfPeople: data.numberOfPeople,
            notes: data.notes,
            tourName: tour.name,
            basePrice: basePrice,
            kitQuantity: kitQuantity,
            kitUnitPrice: kitUnitPrice,
            kitDiscount: kitDiscount,
            totalPrice: totalPrice,
          },
        },
      });

      // Show toast
      toast({
        title: 'Redirecionando para checkout',
        description: 'Complete sua reserva na próxima página.',
      });
    } catch (error) {
      toast({
        title: 'Erro ao processar reserva',
        description: 'Tente novamente.',
        variant: 'destructive',
      });
      console.error('Erro ao processar reserva:', error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-card rounded-xl shadow-lg p-6 md:p-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Nome */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome Completo *</FormLabel>
                  <FormControl>
                    <Input placeholder="João Silva" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email *</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="joao@exemplo.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Telefone */}
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefone/WhatsApp *</FormLabel>
                  <FormControl>
                    <Input placeholder="(83) 99999-9999" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Número de Pessoas */}
            <FormField
              control={form.control}
              name="numberOfPeople"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Número de Pessoas (opcional)</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Users className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="number"
                        min="1"
                        max="7"
                        className="pl-10"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormDescription>
                    Máximo 7 pessoas por barco
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Data */}
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Data Desejada *</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            'w-full pl-3 text-left font-normal',
                            !field.value && 'text-muted-foreground'
                          )}
                        >
                          {field.value ? (
                            format(field.value, "dd 'de' MMMM 'de' yyyy", {
                              locale: ptBR,
                            })
                          ) : (
                            <span>Selecione uma data</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date < new Date() || date < new Date('1900-01-01')
                        }
                        initialFocus
                        locale={ptBR}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    Confirmaremos a disponibilidade conforme a maré
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Kit Tranquilidade */}
          <div className="border rounded-lg p-4 bg-muted/30">
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
                      <Badge className="bg-success text-success-foreground gap-1">
                        <Percent className="w-3 h-3" />
                        10% OFF
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
                          className={cn(
                            "flex-1",
                            field.value === qty && "bg-primary"
                          )}
                          onClick={() => field.onChange(qty)}
                        >
                          {qty === 0 ? 'Sem kit' : `${qty} kit${qty > 1 ? 's' : ''}`}
                          {qty === 2 && <span className="ml-1 text-xs">(10% OFF)</span>}
                        </Button>
                      ))}
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          {/* Resumo do Valor */}
          <div className="bg-primary/5 rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Passeio {tour.name}</span>
              <span>R$ {basePrice.toLocaleString('pt-BR')}</span>
            </div>
            {kitQuantity > 0 && (
              <>
                <div className="flex justify-between text-sm">
                  <span>Kit Tranquilidade ({kitQuantity}x)</span>
                  <span>R$ {kitSubtotal.toLocaleString('pt-BR')}</span>
                </div>
                {kitDiscount > 0 && (
                  <div className="flex justify-between text-sm text-success">
                    <span>Desconto (10%)</span>
                    <span>- R$ {kitDiscount.toLocaleString('pt-BR')}</span>
                  </div>
                )}
              </>
            )}
            <div className="border-t pt-2 mt-2">
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-accent">R$ {totalPrice.toLocaleString('pt-BR')}</span>
              </div>
              <p className="text-sm text-muted-foreground text-right">
                ou 12x de R$ {installmentPrice}
              </p>
            </div>
          </div>

          {/* Observações */}
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Observações (Opcional)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Alguma informação adicional ou solicitação especial?"
                    className="resize-none"
                    rows={3}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Botão de Envio */}
          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>Processando...</>
            ) : (
              <>
                <Send className="mr-2 h-5 w-5" />
                Continuar para Pagamento
              </>
            )}
          </Button>

          <p className="text-sm text-muted-foreground text-center">
            Ao clicar, você será direcionado para o checkout seguro para
            completar sua reserva e realizar o pagamento.
          </p>

          {/* Refund Policy */}
          <div className="bg-info/10 rounded-lg p-3 border border-info/20">
            <p className="text-xs sm:text-sm text-info font-medium text-center">
              Reembolso integral em caso de cancelamento por condições climáticas desfavoráveis
            </p>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default BookingForm;
