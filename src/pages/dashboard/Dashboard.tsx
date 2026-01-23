import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  DollarSign,
  Calendar,
  Users,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

// Mock data - será substituído por dados reais da API
const stats = [
  {
    title: 'Faturamento do Mês',
    value: 'R$ 15.393',
    change: '+12%',
    changeType: 'positive' as const,
    icon: DollarSign,
  },
  {
    title: 'Reservas Confirmadas',
    value: '7',
    change: '+3 esta semana',
    changeType: 'positive' as const,
    icon: Calendar,
  },
  {
    title: 'Novos Leads',
    value: '23',
    change: '+5 hoje',
    changeType: 'positive' as const,
    icon: Users,
  },
  {
    title: 'Taxa de Conversão',
    value: '30%',
    change: '+2%',
    changeType: 'positive' as const,
    icon: TrendingUp,
  },
];

const upcomingBookings = [
  {
    id: '1',
    customerName: 'João Silva',
    date: '2024-01-20',
    time: '09:00',
    people: 5,
    status: 'confirmed',
    total: 2199,
  },
  {
    id: '2',
    customerName: 'Maria Santos',
    date: '2024-01-21',
    time: '10:30',
    people: 4,
    status: 'pending',
    total: 2599,
  },
  {
    id: '3',
    customerName: 'Pedro Costa',
    date: '2024-01-22',
    time: '08:00',
    people: 7,
    status: 'confirmed',
    total: 2199,
  },
];

const recentActivity = [
  {
    id: '1',
    type: 'booking',
    message: 'Nova reserva de João Silva para 20/01',
    time: '5 min atrás',
  },
  {
    id: '2',
    type: 'lead',
    message: 'Novo lead: Maria via Instagram',
    time: '15 min atrás',
  },
  {
    id: '3',
    type: 'payment',
    message: 'Pagamento confirmado - R$ 2.199',
    time: '1 hora atrás',
  },
  {
    id: '4',
    type: 'booking',
    message: 'Reserva concluída - Pedro Costa',
    time: '2 horas atrás',
  },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'confirmed':
      return <Badge className="bg-green-100 text-green-800">Confirmado</Badge>;
    case 'pending':
      return <Badge className="bg-yellow-100 text-yellow-800">Pendente</Badge>;
    case 'paid':
      return <Badge className="bg-blue-100 text-blue-800">Pago</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

const Dashboard = () => {
  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold mt-1">{stat.value}</p>
                    <p
                      className={`text-xs mt-1 ${
                        stat.changeType === 'positive'
                          ? 'text-green-600'
                          : 'text-red-600'
                      }`}
                    >
                      {stat.change}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Two columns layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Bookings */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Próximos Passeios
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-primary font-semibold">
                        {booking.customerName.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-sm">{booking.customerName}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        <span>
                          {new Date(booking.date).toLocaleDateString('pt-BR')} às{' '}
                          {booking.time}
                        </span>
                        <span>•</span>
                        <span>{booking.people} pessoas</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    {getStatusBadge(booking.status)}
                    <p className="text-sm font-medium mt-1">
                      R$ {booking.total.toLocaleString('pt-BR')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Atividade Recente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      activity.type === 'booking'
                        ? 'bg-blue-100'
                        : activity.type === 'lead'
                        ? 'bg-purple-100'
                        : 'bg-green-100'
                    }`}
                  >
                    {activity.type === 'booking' ? (
                      <Calendar className="w-4 h-4 text-blue-600" />
                    ) : activity.type === 'lead' ? (
                      <Users className="w-4 h-4 text-purple-600" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">{activity.message}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Ações Rápidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="p-4 rounded-lg border hover:bg-muted transition-colors text-center">
              <Calendar className="w-6 h-6 mx-auto mb-2 text-primary" />
              <span className="text-sm font-medium">Nova Reserva</span>
            </button>
            <button className="p-4 rounded-lg border hover:bg-muted transition-colors text-center">
              <Users className="w-6 h-6 mx-auto mb-2 text-primary" />
              <span className="text-sm font-medium">Adicionar Lead</span>
            </button>
            <button className="p-4 rounded-lg border hover:bg-muted transition-colors text-center">
              <AlertCircle className="w-6 h-6 mx-auto mb-2 text-primary" />
              <span className="text-sm font-medium">Bloquear Data</span>
            </button>
            <button className="p-4 rounded-lg border hover:bg-muted transition-colors text-center">
              <DollarSign className="w-6 h-6 mx-auto mb-2 text-primary" />
              <span className="text-sm font-medium">Registrar Pagamento</span>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
