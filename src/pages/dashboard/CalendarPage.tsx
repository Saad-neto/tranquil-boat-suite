import { useState } from 'react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday, isBefore, startOfToday } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Lock,
  Unlock,
  Clock,
  Users,
  AlertCircle,
  Settings,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Mock data - será substituído por dados reais
const mockBookings = [
  { date: '2024-01-20', customerName: 'João Silva', people: 5, status: 'confirmed' },
  { date: '2024-01-21', customerName: 'Maria Santos', people: 4, status: 'pending' },
  { date: '2024-01-25', customerName: 'Pedro Costa', people: 7, status: 'confirmed' },
];

const mockBlockedDates = [
  { date: '2024-01-15', reason: 'Manutenção do barco' },
  { date: '2024-01-16', reason: 'Manutenção do barco' },
  { date: '2024-01-28', reason: 'Indisponível' },
];

// Configuração de agenda aberta (até quando aceita reservas)
const scheduleConfig = {
  openUntil: '2024-03-31', // Agenda aberta até esta data
  minAdvanceDays: 2, // Mínimo de dias de antecedência
};

const CalendarPage = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isBlockDialogOpen, setIsBlockDialogOpen] = useState(false);
  const [isSettingsDialogOpen, setIsSettingsDialogOpen] = useState(false);
  const [blockReason, setBlockReason] = useState('');
  const [blockedDates, setBlockedDates] = useState(mockBlockedDates);
  const [openUntil, setOpenUntil] = useState(scheduleConfig.openUntil);

  const today = startOfToday();
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Preencher dias vazios no início (para começar no domingo)
  const startDay = monthStart.getDay();
  const prefixDays = Array(startDay).fill(null);

  const getDateStatus = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');

    // Verificar se está bloqueado
    const blocked = blockedDates.find((b) => b.date === dateStr);
    if (blocked) return { type: 'blocked', data: blocked };

    // Verificar se tem reserva
    const booking = mockBookings.find((b) => b.date === dateStr);
    if (booking) return { type: 'booked', data: booking };

    // Verificar se está fora do período de agenda aberta
    const openUntilDate = new Date(openUntil);
    if (date > openUntilDate) return { type: 'closed', data: null };

    // Verificar se é passado
    if (isBefore(date, today)) return { type: 'past', data: null };

    return { type: 'available', data: null };
  };

  const handleDateClick = (date: Date) => {
    const status = getDateStatus(date);
    if (status.type === 'past') return;
    setSelectedDate(date);
    setIsBlockDialogOpen(true);
    setBlockReason(status.type === 'blocked' ? (status.data as any)?.reason || '' : '');
  };

  const handleBlockDate = () => {
    if (!selectedDate) return;

    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    const existingIndex = blockedDates.findIndex((b) => b.date === dateStr);

    if (existingIndex >= 0) {
      // Desbloquear
      setBlockedDates(blockedDates.filter((_, i) => i !== existingIndex));
    } else {
      // Bloquear
      setBlockedDates([...blockedDates, { date: dateStr, reason: blockReason }]);
    }

    setIsBlockDialogOpen(false);
    setBlockReason('');
  };

  const handleSaveSettings = () => {
    // Aqui salvaria as configurações na API
    setIsSettingsDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header com configurações */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold">Calendário de Disponibilidade</h2>
          <p className="text-muted-foreground text-sm">
            Agenda aberta até {format(new Date(openUntil), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
          </p>
        </div>
        <Button variant="outline" onClick={() => setIsSettingsDialogOpen(true)}>
          <Settings className="w-4 h-4 mr-2" />
          Configurar Agenda
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <CardTitle className="text-lg">
                {format(currentMonth, 'MMMM yyyy', { locale: ptBR })}
              </CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Week days header */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day) => (
                <div
                  key={day}
                  className="text-center text-xs font-medium text-muted-foreground py-2"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar days */}
            <div className="grid grid-cols-7 gap-1">
              {prefixDays.map((_, index) => (
                <div key={`prefix-${index}`} className="aspect-square" />
              ))}

              {days.map((day) => {
                const status = getDateStatus(day);
                const isSelected = selectedDate && isSameDay(day, selectedDate);

                return (
                  <button
                    key={day.toISOString()}
                    onClick={() => handleDateClick(day)}
                    disabled={status.type === 'past'}
                    className={cn(
                      'aspect-square p-1 rounded-lg text-sm relative transition-colors',
                      'hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary',
                      status.type === 'past' && 'opacity-30 cursor-not-allowed',
                      status.type === 'blocked' && 'bg-red-100 text-red-800',
                      status.type === 'booked' && 'bg-blue-100 text-blue-800',
                      status.type === 'closed' && 'bg-gray-100 text-gray-400',
                      status.type === 'available' && 'hover:bg-green-50',
                      isToday(day) && 'ring-2 ring-primary',
                      isSelected && 'ring-2 ring-primary ring-offset-2'
                    )}
                  >
                    <span className="font-medium">{format(day, 'd')}</span>
                    {status.type === 'blocked' && (
                      <Lock className="w-3 h-3 absolute bottom-1 right-1" />
                    )}
                    {status.type === 'booked' && (
                      <Users className="w-3 h-3 absolute bottom-1 right-1" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t text-xs">
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 bg-green-50 border rounded" />
                <span>Disponível</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 bg-blue-100 rounded" />
                <span>Reservado</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 bg-red-100 rounded" />
                <span>Bloqueado</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 bg-gray-100 rounded" />
                <span>Agenda Fechada</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Próximas reservas */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Próximas Reservas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {mockBookings.slice(0, 3).map((booking, index) => (
                <div key={index} className="p-2 bg-muted/50 rounded-lg">
                  <p className="font-medium text-sm">{booking.customerName}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                    <Clock className="w-3 h-3" />
                    <span>{format(new Date(booking.date), "dd/MM/yyyy", { locale: ptBR })}</span>
                    <span>•</span>
                    <span>{booking.people} pessoas</span>
                  </div>
                  <Badge
                    className={cn(
                      'mt-2 text-xs',
                      booking.status === 'confirmed'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    )}
                  >
                    {booking.status === 'confirmed' ? 'Confirmado' : 'Pendente'}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Datas bloqueadas */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Datas Bloqueadas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {blockedDates.length === 0 ? (
                <p className="text-sm text-muted-foreground">Nenhuma data bloqueada</p>
              ) : (
                blockedDates.map((blocked, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-red-50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-sm text-red-800">
                        {format(new Date(blocked.date), "dd/MM/yyyy")}
                      </p>
                      <p className="text-xs text-red-600">{blocked.reason}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setBlockedDates(blockedDates.filter((_, i) => i !== index));
                      }}
                    >
                      <Unlock className="w-4 h-4" />
                    </Button>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Block Date Dialog */}
      <Dialog open={isBlockDialogOpen} onOpenChange={setIsBlockDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedDate && format(selectedDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
            </DialogTitle>
          </DialogHeader>

          {selectedDate && (
            <div className="space-y-4">
              {getDateStatus(selectedDate).type === 'booked' ? (
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="font-medium text-blue-800">Reserva existente</p>
                  <p className="text-sm text-blue-600 mt-1">
                    {(getDateStatus(selectedDate).data as any)?.customerName} -{' '}
                    {(getDateStatus(selectedDate).data as any)?.people} pessoas
                  </p>
                </div>
              ) : getDateStatus(selectedDate).type === 'blocked' ? (
                <div className="space-y-4">
                  <div className="p-4 bg-red-50 rounded-lg">
                    <p className="font-medium text-red-800">Data bloqueada</p>
                    <p className="text-sm text-red-600 mt-1">
                      {(getDateStatus(selectedDate).data as any)?.reason}
                    </p>
                  </div>
                  <Button onClick={handleBlockDate} variant="outline" className="w-full">
                    <Unlock className="w-4 h-4 mr-2" />
                    Desbloquear Data
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="reason">Motivo do bloqueio</Label>
                    <Textarea
                      id="reason"
                      value={blockReason}
                      onChange={(e) => setBlockReason(e.target.value)}
                      placeholder="Ex: Manutenção, Indisponível, etc."
                      className="mt-1"
                    />
                  </div>
                  <Button onClick={handleBlockDate} className="w-full">
                    <Lock className="w-4 h-4 mr-2" />
                    Bloquear Data
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Settings Dialog */}
      <Dialog open={isSettingsDialogOpen} onOpenChange={setIsSettingsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Configurações da Agenda</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="openUntil">Agenda aberta até</Label>
              <input
                type="date"
                id="openUntil"
                value={openUntil}
                onChange={(e) => setOpenUntil(e.target.value)}
                className="w-full mt-1 p-2 border rounded-lg"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Reservas só serão aceitas até esta data
              </p>
            </div>

            <div className="p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-primary" />
                <p className="text-sm font-medium">Dica</p>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Mantenha a agenda aberta com pelo menos 2-3 meses de antecedência para maximizar reservas.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSettingsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveSettings}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CalendarPage;
