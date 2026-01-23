import { useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Search,
  Filter,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  Phone,
  Mail,
  Users,
  Calendar,
  DollarSign,
  UtensilsCrossed,
  QrCode,
  CreditCard,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { PixPayment, CardPayment } from '@/components/payment';
import { toast } from 'sonner';

// Mock data
const mockBookings = [
  {
    id: '1',
    bookingNumber: 'TB-2024-001',
    customerName: 'João Silva',
    customerPhone: '(83) 99999-1111',
    customerEmail: 'joao@email.com',
    date: '2024-01-20',
    time: '09:00',
    numberOfPeople: 5,
    tourName: 'Areia Vermelha + Pôr do Sol do Jacaré',
    basePrice: 2199,
    hasChurrasco: true,
    churrascoPrice: 400,
    totalPrice: 2599,
    paidAmount: 2599,
    status: 'confirmed',
    paymentStatus: 'paid',
    notes: 'Cliente quer parar mais tempo na Areia Vermelha',
    createdAt: '2024-01-10',
  },
  {
    id: '2',
    bookingNumber: 'TB-2024-002',
    customerName: 'Maria Santos',
    customerPhone: '(83) 99999-2222',
    customerEmail: 'maria@email.com',
    date: '2024-01-21',
    time: '10:30',
    numberOfPeople: 4,
    tourName: 'Areia Vermelha + Pôr do Sol do Jacaré',
    basePrice: 2199,
    hasChurrasco: false,
    churrascoPrice: 0,
    totalPrice: 2199,
    paidAmount: 0,
    status: 'pending',
    paymentStatus: 'pending',
    notes: '',
    createdAt: '2024-01-12',
  },
  {
    id: '3',
    bookingNumber: 'TB-2024-003',
    customerName: 'Pedro Costa',
    customerPhone: '(83) 99999-3333',
    customerEmail: 'pedro@email.com',
    date: '2024-01-22',
    time: '08:00',
    numberOfPeople: 7,
    tourName: 'Areia Vermelha + Pôr do Sol do Jacaré',
    basePrice: 2199,
    hasChurrasco: true,
    churrascoPrice: 400,
    totalPrice: 2599,
    paidAmount: 1300,
    status: 'confirmed',
    paymentStatus: 'partial',
    notes: 'Comemoração de aniversário',
    createdAt: '2024-01-08',
  },
  {
    id: '4',
    bookingNumber: 'TB-2024-004',
    customerName: 'Ana Oliveira',
    customerPhone: '(83) 99999-4444',
    customerEmail: 'ana@email.com',
    date: '2024-01-18',
    time: '09:00',
    numberOfPeople: 6,
    tourName: 'Areia Vermelha + Pôr do Sol do Jacaré',
    basePrice: 2199,
    hasChurrasco: false,
    churrascoPrice: 0,
    totalPrice: 2199,
    paidAmount: 2199,
    status: 'completed',
    paymentStatus: 'paid',
    notes: '',
    createdAt: '2024-01-05',
  },
];

type BookingStatus = 'pending' | 'confirmed' | 'paid' | 'completed' | 'cancelled';
type PaymentStatus = 'pending' | 'partial' | 'paid';

const statusConfig: Record<BookingStatus, { label: string; color: string }> = {
  pending: { label: 'Pendente', color: 'bg-yellow-100 text-yellow-800' },
  confirmed: { label: 'Confirmado', color: 'bg-blue-100 text-blue-800' },
  paid: { label: 'Pago', color: 'bg-green-100 text-green-800' },
  completed: { label: 'Concluído', color: 'bg-gray-100 text-gray-800' },
  cancelled: { label: 'Cancelado', color: 'bg-red-100 text-red-800' },
};

const paymentStatusConfig: Record<PaymentStatus, { label: string; color: string }> = {
  pending: { label: 'Pendente', color: 'bg-yellow-100 text-yellow-800' },
  partial: { label: 'Parcial', color: 'bg-orange-100 text-orange-800' },
  paid: { label: 'Pago', color: 'bg-green-100 text-green-800' },
};

const BookingsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedBooking, setSelectedBooking] = useState<typeof mockBookings[0] | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);

  // Payment state
  const [isPixPaymentOpen, setIsPixPaymentOpen] = useState(false);
  const [isCardPaymentOpen, setIsCardPaymentOpen] = useState(false);
  const [paymentBooking, setPaymentBooking] = useState<typeof mockBookings[0] | null>(null);

  const filteredBookings = mockBookings.filter((booking) => {
    const matchesSearch =
      booking.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.bookingNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.customerPhone.includes(searchQuery);

    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleViewDetails = (booking: typeof mockBookings[0]) => {
    setSelectedBooking(booking);
    setIsDetailDialogOpen(true);
  };

  const handlePixPayment = (booking: typeof mockBookings[0]) => {
    setPaymentBooking(booking);
    setIsPixPaymentOpen(true);
  };

  const handleCardPayment = (booking: typeof mockBookings[0]) => {
    setPaymentBooking(booking);
    setIsCardPaymentOpen(true);
  };

  const handlePaymentCreated = () => {
    toast.success('Pagamento registrado! Atualize a página para ver as mudanças.');
    // In a real app, you would refetch the bookings here
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {mockBookings.filter((b) => b.status === 'pending').length}
                </p>
                <p className="text-xs text-muted-foreground">Pendentes</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {mockBookings.filter((b) => b.status === 'confirmed').length}
                </p>
                <p className="text-xs text-muted-foreground">Confirmadas</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {mockBookings.filter((b) => b.paymentStatus === 'paid').length}
                </p>
                <p className="text-xs text-muted-foreground">Pagas</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{mockBookings.length}</p>
                <p className="text-xs text-muted-foreground">Total</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome, telefone ou número..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filtrar status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="pending">Pendentes</SelectItem>
                <SelectItem value="confirmed">Confirmadas</SelectItem>
                <SelectItem value="paid">Pagas</SelectItem>
                <SelectItem value="completed">Concluídas</SelectItem>
                <SelectItem value="cancelled">Canceladas</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Bookings List */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Reservas ({filteredBookings.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredBookings.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                Nenhuma reserva encontrada
              </p>
            ) : (
              filteredBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-muted/50 rounded-lg gap-4"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-primary font-semibold text-lg">
                        {booking.customerName.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold">{booking.customerName}</p>
                        <span className="text-xs text-muted-foreground">
                          {booking.bookingNumber}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1 flex-wrap">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {format(new Date(booking.date), "dd/MM/yyyy")}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {booking.time}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {booking.numberOfPeople} pessoas
                        </span>
                        {booking.hasChurrasco && (
                          <span className="flex items-center gap-1 text-orange-600">
                            <UtensilsCrossed className="w-3 h-3" />
                            Churrasco
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge className={statusConfig[booking.status as BookingStatus].color}>
                          {statusConfig[booking.status as BookingStatus].label}
                        </Badge>
                        <Badge className={paymentStatusConfig[booking.paymentStatus as PaymentStatus].color}>
                          {paymentStatusConfig[booking.paymentStatus as PaymentStatus].label}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 sm:flex-col sm:items-end">
                    <div className="text-right">
                      <p className="text-lg font-bold">
                        R$ {booking.totalPrice.toLocaleString('pt-BR')}
                      </p>
                      {booking.paymentStatus === 'partial' && (
                        <p className="text-xs text-muted-foreground">
                          Pago: R$ {booking.paidAmount.toLocaleString('pt-BR')}
                        </p>
                      )}
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewDetails(booking)}>
                          <Eye className="w-4 h-4 mr-2" />
                          Ver Detalhes
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="w-4 h-4 mr-2" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Confirmar
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {booking.paymentStatus !== 'paid' && (
                          <>
                            <DropdownMenuItem onClick={() => handlePixPayment(booking)}>
                              <QrCode className="w-4 h-4 mr-2" />
                              Cobrar via PIX
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleCardPayment(booking)}>
                              <CreditCard className="w-4 h-4 mr-2" />
                              Cobrar no Cartão
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                          </>
                        )}
                        <DropdownMenuItem className="text-red-600">
                          <XCircle className="w-4 h-4 mr-2" />
                          Cancelar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Detalhes da Reserva</DialogTitle>
          </DialogHeader>

          {selectedBooking && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Número</span>
                <span className="font-mono">{selectedBooking.bookingNumber}</span>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold mb-2">Cliente</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span>{selectedBooking.customerName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <a href={`tel:${selectedBooking.customerPhone}`} className="text-primary hover:underline">
                      {selectedBooking.customerPhone}
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <a href={`mailto:${selectedBooking.customerEmail}`} className="text-primary hover:underline">
                      {selectedBooking.customerEmail}
                    </a>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold mb-2">Passeio</h4>
                <div className="space-y-2 text-sm">
                  <p>{selectedBooking.tourName}</p>
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      {format(new Date(selectedBooking.date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      {selectedBooking.time}
                    </span>
                  </div>
                  <p>{selectedBooking.numberOfPeople} pessoas</p>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold mb-2">Valores</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Passeio</span>
                    <span>R$ {selectedBooking.basePrice.toLocaleString('pt-BR')}</span>
                  </div>
                  {selectedBooking.hasChurrasco && (
                    <div className="flex justify-between">
                      <span>Pacote Churrasco</span>
                      <span>R$ {selectedBooking.churrascoPrice.toLocaleString('pt-BR')}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold pt-2 border-t">
                    <span>Total</span>
                    <span>R$ {selectedBooking.totalPrice.toLocaleString('pt-BR')}</span>
                  </div>
                  <div className="flex justify-between text-green-600">
                    <span>Pago</span>
                    <span>R$ {selectedBooking.paidAmount.toLocaleString('pt-BR')}</span>
                  </div>
                  {selectedBooking.paidAmount < selectedBooking.totalPrice && (
                    <div className="flex justify-between text-orange-600">
                      <span>Restante</span>
                      <span>R$ {(selectedBooking.totalPrice - selectedBooking.paidAmount).toLocaleString('pt-BR')}</span>
                    </div>
                  )}
                </div>
              </div>

              {selectedBooking.notes && (
                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-2">Observações</h4>
                  <p className="text-sm text-muted-foreground">{selectedBooking.notes}</p>
                </div>
              )}

              <div className="flex gap-2 pt-4">
                <Badge className={statusConfig[selectedBooking.status as BookingStatus].color}>
                  {statusConfig[selectedBooking.status as BookingStatus].label}
                </Badge>
                <Badge className={paymentStatusConfig[selectedBooking.paymentStatus as PaymentStatus].color}>
                  Pagamento: {paymentStatusConfig[selectedBooking.paymentStatus as PaymentStatus].label}
                </Badge>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailDialogOpen(false)}>
              Fechar
            </Button>
            <Button>
              <Phone className="w-4 h-4 mr-2" />
              Contatar via WhatsApp
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Payment Modals */}
      {paymentBooking && (
        <>
          <PixPayment
            isOpen={isPixPaymentOpen}
            onClose={() => {
              setIsPixPaymentOpen(false);
              setPaymentBooking(null);
            }}
            bookingId={paymentBooking.id}
            bookingNumber={paymentBooking.bookingNumber}
            customerName={paymentBooking.customerName}
            customerPhone={paymentBooking.customerPhone}
            customerEmail={paymentBooking.customerEmail}
            totalAmount={paymentBooking.totalPrice}
            paidAmount={paymentBooking.paidAmount}
            onPaymentCreated={handlePaymentCreated}
          />

          <CardPayment
            isOpen={isCardPaymentOpen}
            onClose={() => {
              setIsCardPaymentOpen(false);
              setPaymentBooking(null);
            }}
            bookingId={paymentBooking.id}
            bookingNumber={paymentBooking.bookingNumber}
            customerName={paymentBooking.customerName}
            customerPhone={paymentBooking.customerPhone}
            customerEmail={paymentBooking.customerEmail}
            totalAmount={paymentBooking.totalPrice}
            paidAmount={paymentBooking.paidAmount}
            onPaymentCreated={handlePaymentCreated}
          />
        </>
      )}
    </div>
  );
};

export default BookingsPage;
