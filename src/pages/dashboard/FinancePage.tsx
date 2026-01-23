import { useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  CreditCard,
  Wallet,
  PiggyBank,
  Download,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Mock data
const mockTransactions = [
  {
    id: '1',
    type: 'income',
    description: 'Reserva TB-2024-001 - João Silva',
    amount: 2599,
    date: '2024-01-15',
    status: 'completed',
    paymentMethod: 'pix',
  },
  {
    id: '2',
    type: 'income',
    description: 'Reserva TB-2024-002 - Maria Santos (Parcial)',
    amount: 1000,
    date: '2024-01-14',
    status: 'completed',
    paymentMethod: 'credit_card',
  },
  {
    id: '3',
    type: 'expense',
    description: 'Combustível',
    amount: 350,
    date: '2024-01-13',
    status: 'completed',
    paymentMethod: 'pix',
  },
  {
    id: '4',
    type: 'income',
    description: 'Reserva TB-2024-003 - Pedro Costa (Sinal)',
    amount: 1300,
    date: '2024-01-12',
    status: 'completed',
    paymentMethod: 'pix',
  },
  {
    id: '5',
    type: 'expense',
    description: 'Manutenção do barco',
    amount: 500,
    date: '2024-01-10',
    status: 'completed',
    paymentMethod: 'bank_transfer',
  },
  {
    id: '6',
    type: 'income',
    description: 'Reserva TB-2024-004 - Ana Oliveira',
    amount: 2199,
    date: '2024-01-08',
    status: 'completed',
    paymentMethod: 'credit_card',
  },
];

const monthlyData = [
  { month: 'Jan', income: 15393, expenses: 850, bookings: 7 },
  { month: 'Dez', income: 12500, expenses: 1200, bookings: 5 },
  { month: 'Nov', income: 18200, expenses: 900, bookings: 8 },
];

const pendingPayments = [
  {
    id: '1',
    customerName: 'Maria Santos',
    bookingNumber: 'TB-2024-002',
    totalAmount: 2199,
    paidAmount: 0,
    remainingAmount: 2199,
    dueDate: '2024-01-21',
  },
  {
    id: '2',
    customerName: 'Pedro Costa',
    bookingNumber: 'TB-2024-003',
    totalAmount: 2599,
    paidAmount: 1300,
    remainingAmount: 1299,
    dueDate: '2024-01-22',
  },
];

const paymentMethodLabels: Record<string, string> = {
  pix: 'PIX',
  credit_card: 'Cartão de Crédito',
  bank_transfer: 'Transferência',
  cash: 'Dinheiro',
};

const FinancePage = () => {
  const [periodFilter, setPeriodFilter] = useState('month');

  const totalIncome = mockTransactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = mockTransactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpenses;

  const totalPending = pendingPayments.reduce((sum, p) => sum + p.remainingAmount, 0);

  return (
    <div className="space-y-6">
      {/* Period Filter */}
      <div className="flex justify-between items-center">
        <Select value={periodFilter} onValueChange={setPeriodFilter}>
          <SelectTrigger className="w-48">
            <Calendar className="w-4 h-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">Esta Semana</SelectItem>
            <SelectItem value="month">Este Mês</SelectItem>
            <SelectItem value="quarter">Este Trimestre</SelectItem>
            <SelectItem value="year">Este Ano</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Exportar
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Receitas</p>
                <p className="text-2xl font-bold text-green-600">
                  R$ {totalIncome.toLocaleString('pt-BR')}
                </p>
                <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                  <ArrowUpRight className="w-3 h-3" />
                  +12% vs mês anterior
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Despesas</p>
                <p className="text-2xl font-bold text-red-600">
                  R$ {totalExpenses.toLocaleString('pt-BR')}
                </p>
                <p className="text-xs text-red-600 flex items-center gap-1 mt-1">
                  <ArrowDownRight className="w-3 h-3" />
                  -5% vs mês anterior
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <TrendingDown className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Saldo</p>
                <p className={cn('text-2xl font-bold', balance >= 0 ? 'text-green-600' : 'text-red-600')}>
                  R$ {balance.toLocaleString('pt-BR')}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Lucro líquido do período
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Wallet className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">A Receber</p>
                <p className="text-2xl font-bold text-orange-600">
                  R$ {totalPending.toLocaleString('pt-BR')}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {pendingPayments.length} pagamentos pendentes
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                <PiggyBank className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Transactions */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Transações Recentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        'w-10 h-10 rounded-full flex items-center justify-center',
                        transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'
                      )}
                    >
                      {transaction.type === 'income' ? (
                        <ArrowUpRight className="w-5 h-5 text-green-600" />
                      ) : (
                        <ArrowDownRight className="w-5 h-5 text-red-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{transaction.description}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{format(new Date(transaction.date), "dd/MM/yyyy")}</span>
                        <span>•</span>
                        <span>{paymentMethodLabels[transaction.paymentMethod]}</span>
                      </div>
                    </div>
                  </div>
                  <p
                    className={cn(
                      'font-bold',
                      transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                    )}
                  >
                    {transaction.type === 'income' ? '+' : '-'}R${' '}
                    {transaction.amount.toLocaleString('pt-BR')}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pending Payments */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Pagamentos Pendentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingPayments.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  Nenhum pagamento pendente
                </p>
              ) : (
                pendingPayments.map((payment) => (
                  <div
                    key={payment.id}
                    className="p-3 bg-orange-50 border border-orange-200 rounded-lg"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium text-sm">{payment.customerName}</p>
                      <Badge variant="outline" className="text-xs">
                        {payment.bookingNumber}
                      </Badge>
                    </div>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Total:</span>
                        <span>R$ {payment.totalAmount.toLocaleString('pt-BR')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Pago:</span>
                        <span className="text-green-600">
                          R$ {payment.paidAmount.toLocaleString('pt-BR')}
                        </span>
                      </div>
                      <div className="flex justify-between font-bold">
                        <span>Restante:</span>
                        <span className="text-orange-600">
                          R$ {payment.remainingAmount.toLocaleString('pt-BR')}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-2 pt-2 border-t border-orange-200 text-xs text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      <span>Vencimento: {format(new Date(payment.dueDate), "dd/MM/yyyy")}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Summary */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Resumo Mensal</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium">Mês</th>
                  <th className="text-right py-3 px-4 font-medium">Reservas</th>
                  <th className="text-right py-3 px-4 font-medium">Receitas</th>
                  <th className="text-right py-3 px-4 font-medium">Despesas</th>
                  <th className="text-right py-3 px-4 font-medium">Lucro</th>
                </tr>
              </thead>
              <tbody>
                {monthlyData.map((data) => (
                  <tr key={data.month} className="border-b last:border-0">
                    <td className="py-3 px-4 font-medium">{data.month} 2024</td>
                    <td className="py-3 px-4 text-right">{data.bookings}</td>
                    <td className="py-3 px-4 text-right text-green-600">
                      R$ {data.income.toLocaleString('pt-BR')}
                    </td>
                    <td className="py-3 px-4 text-right text-red-600">
                      R$ {data.expenses.toLocaleString('pt-BR')}
                    </td>
                    <td className="py-3 px-4 text-right font-bold">
                      R$ {(data.income - data.expenses).toLocaleString('pt-BR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinancePage;
