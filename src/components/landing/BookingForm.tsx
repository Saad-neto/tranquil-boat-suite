import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar as CalendarIcon, Users, Send } from 'lucide-react';
import { tours } from '@/data/tours';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

// Schema de validação com Zod
const bookingFormSchema = z.object({
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  email: z.string().email('Email inválido'),
  phone: z
    .string()
    .min(10, 'Telefone inválido')
    .regex(/^[\d\s()+\-]+$/, 'Telefone deve conter apenas números e símbolos válidos'),
  tourId: z.string().min(1, 'Selecione um passeio'),
  date: z.date({
    required_error: 'Selecione uma data',
  }),
  numberOfPeople: z.coerce
    .number()
    .min(1, 'Mínimo 1 pessoa')
    .max(20, 'Máximo 20 pessoas'),
  notes: z.string().optional(),
});

type BookingFormValues = z.infer<typeof bookingFormSchema>;

const BookingForm = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      tourId: '',
      numberOfPeople: 2,
      notes: '',
    },
  });

  const onSubmit = async (data: BookingFormValues) => {
    setIsSubmitting(true);

    try {
      // Encontrar o tour selecionado
      const selectedTour = tours.find((tour) => tour.id === data.tourId);
      if (!selectedTour) {
        throw new Error('Passeio não encontrado');
      }

      // Formatar a data
      const formattedDate = format(data.date, "dd 'de' MMMM 'de' yyyy", {
        locale: ptBR,
      });

      // Calcular valor total
      const totalValue = selectedTour.price * data.numberOfPeople;

      // Criar mensagem para WhatsApp
      const message = `🚤 *NOVA RESERVA - Tranquilidade Boat*\n\n` +
        `👤 *Cliente:* ${data.name}\n` +
        `📧 *Email:* ${data.email}\n` +
        `📱 *Telefone:* ${data.phone}\n\n` +
        `🌊 *Passeio:* ${selectedTour.name}\n` +
        `📅 *Data:* ${formattedDate}\n` +
        `👥 *Pessoas:* ${data.numberOfPeople}\n` +
        `💰 *Valor Total:* R$ ${totalValue.toFixed(2).replace('.', ',')}\n` +
        (data.notes ? `\n📝 *Observações:* ${data.notes}\n` : '') +
        `\n_Enviado via formulário do site_`;

      // Número do WhatsApp Business (substitua pelo número real)
      // Formato: código do país (55) + DDD + número
      const whatsappNumber = '5583999999999'; // SUBSTITUIR pelo número real

      // Criar link do WhatsApp
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

      // Abrir WhatsApp
      window.open(whatsappUrl, '_blank');

      // Mostrar toast de sucesso
      toast({
        title: 'Reserva Iniciada!',
        description: 'Você será redirecionado para o WhatsApp para confirmar sua reserva.',
      });

      // Limpar formulário após 2 segundos
      setTimeout(() => {
        form.reset();
      }, 2000);
    } catch (error) {
      toast({
        title: 'Erro ao processar reserva',
        description: 'Tente novamente ou entre em contato pelo WhatsApp.',
        variant: 'destructive',
      });
      console.error('Erro ao processar reserva:', error);
    } finally {
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
                  <FormLabel>Número de Pessoas *</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Users className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="number"
                        min="1"
                        max="20"
                        className="pl-10"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Passeio */}
            <FormField
              control={form.control}
              name="tourId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Passeio *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um passeio" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {tours
                        .filter((tour) => tour.isActive)
                        .map((tour) => (
                          <SelectItem key={tour.id} value={tour.id}>
                            {tour.name} - R${' '}
                            {tour.price.toFixed(2).replace('.', ',')}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Escolha o passeio que deseja realizar
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
                    Sua data de preferência para o passeio
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
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
                Solicitar Reserva via WhatsApp
              </>
            )}
          </Button>

          <p className="text-sm text-muted-foreground text-center">
            Ao clicar, você será redirecionado para o WhatsApp com os dados
            preenchidos.
          </p>
        </form>
      </Form>
    </div>
  );
};

export default BookingForm;
