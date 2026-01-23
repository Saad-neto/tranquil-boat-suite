import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import {
  Settings,
  Anchor,
  DollarSign,
  Calendar,
  Bell,
  Shield,
  Save,
  Phone,
  Instagram,
  Mail,
} from 'lucide-react';

const SettingsPage = () => {
  const { toast } = useToast();

  // Tour Settings
  const [tourSettings, setTourSettings] = useState({
    name: 'Areia Vermelha + Pôr do Sol do Jacaré',
    price: 2199,
    maxPeople: 7,
    churrascoPrice: 400,
    description: 'Embarque no Jacaré e navegue até a famosa Areia Vermelha...',
  });

  // Business Settings
  const [businessSettings, setBusinessSettings] = useState({
    businessName: 'Tranquilidade Boat',
    phone: '(83) 99999-9999',
    email: 'contato@tranquilidadeboat.com.br',
    instagram: '@tranquilidadeboat',
    address: 'Marina Big Toys - Jacaré, Cabedelo/PB',
  });

  // Calendar Settings
  const [calendarSettings, setCalendarSettings] = useState({
    openUntil: '2024-03-31',
    minAdvanceDays: 2,
    autoBlockPast: true,
  });

  // Notification Settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    whatsappNotifications: true,
    newBookingAlert: true,
    paymentAlert: true,
    reminderAlert: true,
  });

  const handleSave = (section: string) => {
    // Aqui faria a chamada para a API
    toast({
      title: 'Configurações salvas',
      description: `As configurações de ${section} foram atualizadas com sucesso.`,
    });
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Tour Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Anchor className="w-5 h-5" />
            Configurações do Passeio
          </CardTitle>
          <CardDescription>
            Configure os detalhes e preços do seu passeio
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="tourName">Nome do Passeio</Label>
              <Input
                id="tourName"
                value={tourSettings.name}
                onChange={(e) => setTourSettings({ ...tourSettings, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxPeople">Capacidade Máxima</Label>
              <Input
                id="maxPeople"
                type="number"
                value={tourSettings.maxPeople}
                onChange={(e) => setTourSettings({ ...tourSettings, maxPeople: parseInt(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Preço do Passeio (R$)</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="price"
                  type="number"
                  className="pl-9"
                  value={tourSettings.price}
                  onChange={(e) => setTourSettings({ ...tourSettings, price: parseInt(e.target.value) })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="churrascoPrice">Preço do Pacote Churrasco (R$)</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="churrascoPrice"
                  type="number"
                  className="pl-9"
                  value={tourSettings.churrascoPrice}
                  onChange={(e) => setTourSettings({ ...tourSettings, churrascoPrice: parseInt(e.target.value) })}
                />
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              rows={3}
              value={tourSettings.description}
              onChange={(e) => setTourSettings({ ...tourSettings, description: e.target.value })}
            />
          </div>
          <Button onClick={() => handleSave('passeio')}>
            <Save className="w-4 h-4 mr-2" />
            Salvar Passeio
          </Button>
        </CardContent>
      </Card>

      {/* Business Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Dados do Negócio
          </CardTitle>
          <CardDescription>
            Informações de contato e identificação
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="businessName">Nome do Negócio</Label>
              <Input
                id="businessName"
                value={businessSettings.businessName}
                onChange={(e) => setBusinessSettings({ ...businessSettings, businessName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone/WhatsApp</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="phone"
                  className="pl-9"
                  value={businessSettings.phone}
                  onChange={(e) => setBusinessSettings({ ...businessSettings, phone: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  className="pl-9"
                  value={businessSettings.email}
                  onChange={(e) => setBusinessSettings({ ...businessSettings, email: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="instagram">Instagram</Label>
              <div className="relative">
                <Instagram className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="instagram"
                  className="pl-9"
                  value={businessSettings.instagram}
                  onChange={(e) => setBusinessSettings({ ...businessSettings, instagram: e.target.value })}
                />
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Endereço / Ponto de Encontro</Label>
            <Input
              id="address"
              value={businessSettings.address}
              onChange={(e) => setBusinessSettings({ ...businessSettings, address: e.target.value })}
            />
          </div>
          <Button onClick={() => handleSave('negócio')}>
            <Save className="w-4 h-4 mr-2" />
            Salvar Dados
          </Button>
        </CardContent>
      </Card>

      {/* Calendar Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Configurações da Agenda
          </CardTitle>
          <CardDescription>
            Controle a disponibilidade e período de reservas
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="openUntil">Agenda Aberta Até</Label>
              <Input
                id="openUntil"
                type="date"
                value={calendarSettings.openUntil}
                onChange={(e) => setCalendarSettings({ ...calendarSettings, openUntil: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">
                Reservas só serão aceitas até esta data
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="minAdvanceDays">Antecedência Mínima (dias)</Label>
              <Input
                id="minAdvanceDays"
                type="number"
                min="0"
                value={calendarSettings.minAdvanceDays}
                onChange={(e) => setCalendarSettings({ ...calendarSettings, minAdvanceDays: parseInt(e.target.value) })}
              />
              <p className="text-xs text-muted-foreground">
                Dias de antecedência para aceitar reservas
              </p>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>Bloquear Datas Passadas Automaticamente</Label>
              <p className="text-xs text-muted-foreground">
                Datas anteriores a hoje serão bloqueadas automaticamente
              </p>
            </div>
            <Switch
              checked={calendarSettings.autoBlockPast}
              onCheckedChange={(checked) => setCalendarSettings({ ...calendarSettings, autoBlockPast: checked })}
            />
          </div>
          <Button onClick={() => handleSave('agenda')}>
            <Save className="w-4 h-4 mr-2" />
            Salvar Agenda
          </Button>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notificações
          </CardTitle>
          <CardDescription>
            Configure como você deseja receber alertas
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Notificações por Email</Label>
                <p className="text-xs text-muted-foreground">
                  Receba alertas no seu email
                </p>
              </div>
              <Switch
                checked={notificationSettings.emailNotifications}
                onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, emailNotifications: checked })}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label>Notificações por WhatsApp</Label>
                <p className="text-xs text-muted-foreground">
                  Receba alertas no WhatsApp
                </p>
              </div>
              <Switch
                checked={notificationSettings.whatsappNotifications}
                onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, whatsappNotifications: checked })}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label>Alerta de Nova Reserva</Label>
                <p className="text-xs text-muted-foreground">
                  Ser notificado quando uma nova reserva for feita
                </p>
              </div>
              <Switch
                checked={notificationSettings.newBookingAlert}
                onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, newBookingAlert: checked })}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label>Alerta de Pagamento</Label>
                <p className="text-xs text-muted-foreground">
                  Ser notificado quando um pagamento for confirmado
                </p>
              </div>
              <Switch
                checked={notificationSettings.paymentAlert}
                onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, paymentAlert: checked })}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label>Lembrete de Passeio</Label>
                <p className="text-xs text-muted-foreground">
                  Ser lembrado um dia antes de cada passeio
                </p>
              </div>
              <Switch
                checked={notificationSettings.reminderAlert}
                onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, reminderAlert: checked })}
              />
            </div>
          </div>
          <Button onClick={() => handleSave('notificações')}>
            <Save className="w-4 h-4 mr-2" />
            Salvar Notificações
          </Button>
        </CardContent>
      </Card>

      {/* Security */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Segurança
          </CardTitle>
          <CardDescription>
            Gerencie sua senha e acesso
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Senha Atual</Label>
              <Input id="currentPassword" type="password" />
            </div>
            <div></div>
            <div className="space-y-2">
              <Label htmlFor="newPassword">Nova Senha</Label>
              <Input id="newPassword" type="password" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
              <Input id="confirmPassword" type="password" />
            </div>
          </div>
          <Button onClick={() => handleSave('senha')}>
            <Save className="w-4 h-4 mr-2" />
            Alterar Senha
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPage;
