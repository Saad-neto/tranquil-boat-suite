import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
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
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Search,
  Plus,
  MoreVertical,
  Phone,
  Mail,
  Calendar,
  Users,
  MessageCircle,
  Instagram,
  Globe,
  UserPlus,
  ArrowRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Types
type LeadStatus = 'new' | 'contacted' | 'qualified' | 'proposal' | 'won' | 'lost';
type LeadSource = 'instagram' | 'whatsapp' | 'website' | 'referral';

interface Lead {
  id: string;
  name: string;
  phone: string;
  email?: string;
  source: LeadSource;
  status: LeadStatus;
  desiredDate?: string;
  numberOfPeople?: number;
  notes?: string;
  createdAt: string;
  lastContactAt?: string;
}

// Mock data
const mockLeads: Lead[] = [
  {
    id: '1',
    name: 'Carlos Mendes',
    phone: '(83) 99999-5555',
    email: 'carlos@email.com',
    source: 'instagram',
    status: 'new',
    desiredDate: '2024-02-15',
    numberOfPeople: 6,
    notes: 'Interessado no passeio para família',
    createdAt: '2024-01-15T10:30:00',
  },
  {
    id: '2',
    name: 'Fernanda Lima',
    phone: '(83) 99999-6666',
    source: 'whatsapp',
    status: 'contacted',
    desiredDate: '2024-02-20',
    numberOfPeople: 4,
    createdAt: '2024-01-14T15:20:00',
    lastContactAt: '2024-01-15T09:00:00',
  },
  {
    id: '3',
    name: 'Roberto Alves',
    phone: '(83) 99999-7777',
    email: 'roberto@email.com',
    source: 'website',
    status: 'qualified',
    desiredDate: '2024-02-10',
    numberOfPeople: 7,
    notes: 'Quer incluir churrasco',
    createdAt: '2024-01-13T08:45:00',
    lastContactAt: '2024-01-14T16:30:00',
  },
  {
    id: '4',
    name: 'Juliana Costa',
    phone: '(83) 99999-8888',
    source: 'referral',
    status: 'proposal',
    desiredDate: '2024-01-25',
    numberOfPeople: 5,
    notes: 'Indicada por João Silva',
    createdAt: '2024-01-10T11:00:00',
    lastContactAt: '2024-01-15T10:00:00',
  },
  {
    id: '5',
    name: 'Marcos Paulo',
    phone: '(83) 99999-9999',
    source: 'instagram',
    status: 'won',
    desiredDate: '2024-01-20',
    numberOfPeople: 4,
    createdAt: '2024-01-08T14:20:00',
    lastContactAt: '2024-01-12T11:30:00',
  },
  {
    id: '6',
    name: 'Lucia Ferreira',
    phone: '(83) 99999-0000',
    source: 'whatsapp',
    status: 'new',
    numberOfPeople: 3,
    createdAt: '2024-01-15T16:00:00',
  },
];

const columns: { id: LeadStatus; title: string; color: string }[] = [
  { id: 'new', title: 'Novos', color: 'bg-gray-500' },
  { id: 'contacted', title: 'Contatados', color: 'bg-blue-500' },
  { id: 'qualified', title: 'Qualificados', color: 'bg-purple-500' },
  { id: 'proposal', title: 'Proposta', color: 'bg-orange-500' },
  { id: 'won', title: 'Ganhos', color: 'bg-green-500' },
];

const sourceConfig: Record<LeadSource, { icon: any; label: string; color: string }> = {
  instagram: { icon: Instagram, label: 'Instagram', color: 'text-pink-600' },
  whatsapp: { icon: MessageCircle, label: 'WhatsApp', color: 'text-green-600' },
  website: { icon: Globe, label: 'Site', color: 'text-blue-600' },
  referral: { icon: Users, label: 'Indicação', color: 'text-purple-600' },
};

const LeadsPage = () => {
  const [leads, setLeads] = useState(mockLeads);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);

  const filteredLeads = leads.filter(
    (lead) =>
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.phone.includes(searchQuery)
  );

  const getLeadsByStatus = (status: LeadStatus) =>
    filteredLeads.filter((lead) => lead.status === status);

  const moveLeadToNextStatus = (leadId: string) => {
    const statusOrder: LeadStatus[] = ['new', 'contacted', 'qualified', 'proposal', 'won'];
    setLeads(
      leads.map((lead) => {
        if (lead.id === leadId) {
          const currentIndex = statusOrder.indexOf(lead.status);
          if (currentIndex < statusOrder.length - 1) {
            return { ...lead, status: statusOrder[currentIndex + 1] };
          }
        }
        return lead;
      })
    );
  };

  const handleViewDetails = (lead: Lead) => {
    setSelectedLead(lead);
    setIsDetailDialogOpen(true);
  };

  const LeadCard = ({ lead }: { lead: Lead }) => {
    const SourceIcon = sourceConfig[lead.source].icon;

    return (
      <div className="bg-card border rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-primary font-semibold text-sm">
                {lead.name.charAt(0)}
              </span>
            </div>
            <div>
              <p className="font-medium text-sm">{lead.name}</p>
              <p className="text-xs text-muted-foreground">{lead.phone}</p>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <MoreVertical className="w-3 h-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleViewDetails(lead)}>
                Ver Detalhes
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => moveLeadToNextStatus(lead.id)}>
                <ArrowRight className="w-4 h-4 mr-2" />
                Avançar Status
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Phone className="w-4 h-4 mr-2" />
                WhatsApp
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="space-y-1 text-xs">
          {lead.desiredDate && (
            <div className="flex items-center gap-1 text-muted-foreground">
              <Calendar className="w-3 h-3" />
              <span>
                {new Date(lead.desiredDate).toLocaleDateString('pt-BR')}
              </span>
            </div>
          )}
          {lead.numberOfPeople && (
            <div className="flex items-center gap-1 text-muted-foreground">
              <Users className="w-3 h-3" />
              <span>{lead.numberOfPeople} pessoas</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between mt-3 pt-2 border-t">
          <div className={cn('flex items-center gap-1', sourceConfig[lead.source].color)}>
            <SourceIcon className="w-3 h-3" />
            <span className="text-xs">{sourceConfig[lead.source].label}</span>
          </div>
          <span className="text-xs text-muted-foreground">
            {new Date(lead.createdAt).toLocaleDateString('pt-BR')}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar leads..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button>
          <UserPlus className="w-4 h-4 mr-2" />
          Novo Lead
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {columns.map((column) => (
          <Card key={column.id}>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <div className={cn('w-3 h-3 rounded-full', column.color)} />
                <span className="text-sm font-medium">{column.title}</span>
              </div>
              <p className="text-2xl font-bold mt-1">
                {getLeadsByStatus(column.id).length}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Kanban Board */}
      <div className="overflow-x-auto pb-4">
        <div className="flex gap-4 min-w-max">
          {columns.map((column) => (
            <div key={column.id} className="w-72 flex-shrink-0">
              <div className="flex items-center gap-2 mb-3">
                <div className={cn('w-3 h-3 rounded-full', column.color)} />
                <h3 className="font-semibold">{column.title}</h3>
                <Badge variant="outline" className="ml-auto">
                  {getLeadsByStatus(column.id).length}
                </Badge>
              </div>
              <div className="space-y-3 min-h-[200px] bg-muted/30 rounded-lg p-2">
                {getLeadsByStatus(column.id).map((lead) => (
                  <LeadCard key={lead.id} lead={lead} />
                ))}
                {getLeadsByStatus(column.id).length === 0 && (
                  <p className="text-center text-muted-foreground text-sm py-8">
                    Nenhum lead
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detalhes do Lead</DialogTitle>
          </DialogHeader>

          {selectedLead && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-primary font-semibold text-lg">
                    {selectedLead.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-semibold">{selectedLead.name}</p>
                  <div className={cn('flex items-center gap-1 text-sm', sourceConfig[selectedLead.source].color)}>
                    {(() => {
                      const Icon = sourceConfig[selectedLead.source].icon;
                      return <Icon className="w-4 h-4" />;
                    })()}
                    <span>{sourceConfig[selectedLead.source].label}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Telefone</p>
                  <a href={`tel:${selectedLead.phone}`} className="text-primary hover:underline">
                    {selectedLead.phone}
                  </a>
                </div>
                {selectedLead.email && (
                  <div>
                    <p className="text-muted-foreground">Email</p>
                    <a href={`mailto:${selectedLead.email}`} className="text-primary hover:underline">
                      {selectedLead.email}
                    </a>
                  </div>
                )}
                {selectedLead.desiredDate && (
                  <div>
                    <p className="text-muted-foreground">Data Desejada</p>
                    <p>{new Date(selectedLead.desiredDate).toLocaleDateString('pt-BR')}</p>
                  </div>
                )}
                {selectedLead.numberOfPeople && (
                  <div>
                    <p className="text-muted-foreground">Pessoas</p>
                    <p>{selectedLead.numberOfPeople}</p>
                  </div>
                )}
              </div>

              {selectedLead.notes && (
                <div>
                  <p className="text-muted-foreground text-sm">Observações</p>
                  <p className="text-sm mt-1">{selectedLead.notes}</p>
                </div>
              )}

              <div className="flex items-center gap-2 pt-2 border-t text-xs text-muted-foreground">
                <span>Criado em: {new Date(selectedLead.createdAt).toLocaleString('pt-BR')}</span>
                {selectedLead.lastContactAt && (
                  <>
                    <span>•</span>
                    <span>Último contato: {new Date(selectedLead.lastContactAt).toLocaleString('pt-BR')}</span>
                  </>
                )}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailDialogOpen(false)}>
              Fechar
            </Button>
            <Button>
              <MessageCircle className="w-4 h-4 mr-2" />
              WhatsApp
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LeadsPage;
