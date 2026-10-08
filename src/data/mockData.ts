export interface User {
  id: string;
  name: string;
  username: string;
  avatar: string;
  cover?: string;
  bio: string;
  city: string;
  state: string;
  country: string;
  patronSaint: string;
  parish?: string;
  diocese?: string;
  interests: string[];
  joinedAt: string;
  friendsCount: number;
  followersCount: number;
  followingCount: number;
  isVerified?: boolean;
  role?: string;
}

export interface Post {
  id: string;
  author: User;
  content: string;
  image?: string;
  likes: number;
  comments: number;
  shares: number;
  visibility: 'PUBLIC' | 'FRIENDS' | 'FOLLOWERS' | 'PRIVATE' | 'COMMUNITY';
  community?: string;
  createdAt: string;
  liked?: boolean;
  saved?: boolean;
}

export interface Community {
  id: string;
  name: string;
  description: string;
  avatar: string;
  cover?: string;
  members: number;
  type: 'PUBLIC' | 'PRIVATE' | 'SECRET';
  category: string;
  isMember?: boolean;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  location: string;
  startAt: string;
  endAt: string;
  organizer: User | { name: string; avatar: string };
  type: 'MISSA' | 'TERCO' | 'ADORACAO' | 'RETIRIO' | 'CATEQUESE' | 'ENCONTRO' | 'FORMACAO' | 'FESTA';
  visibility: 'PUBLIC' | 'PRIVATE';
  capacity?: number;
  attendees: number;
  status: 'UPCOMING' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';
}

export interface PrayerIntention {
  id: string;
  author: User;
  content: string;
  prayersCount: number;
  isPraying?: boolean;
  createdAt: string;
  visibility: 'PUBLIC' | 'FRIENDS' | 'PRIVATE';
}

export interface Parish {
  id: string;
  name: string;
  diocese: string;
  address: string;
  city: string;
  state: string;
  phone?: string;
  website?: string;
  massSchedule: string[];
  avatar: string;
  isVerified: boolean;
}

export interface Message {
  id: string;
  senderId: string;
  content: string;
  createdAt: string;
  read: boolean;
}

export interface Conversation {
  id: string;
  participants: User[];
  lastMessage: string;
  lastMessageAt: string;
  unread: number;
  isGroup: boolean;
  groupName?: string;
}

export interface Notification {
  id: string;
  type: 'FRIEND_REQUEST' | 'FRIEND_ACCEPTED' | 'POST_LIKE' | 'POST_COMMENT' | 'NEW_FOLLOWER' | 'COMMUNITY_INVITE' | 'EVENT_REMINDER' | 'PRAYER_SUPPORT' | 'SYSTEM';
  from: User;
  content: string;
  createdAt: string;
  read: boolean;
  link?: string;
}

const avatarColors = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4', '#6366f1', '#ef4444'];

function generateAvatar(name: string): string {
  const initials = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  const color = avatarColors[name.length % avatarColors.length];
  return `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect width="100" height="100" fill="${color}" rx="50"/><text x="50" y="55" text-anchor="middle" dy=".1em" fill="white" font-size="36" font-family="Inter,sans-serif" font-weight="600">${initials}</text></svg>`)}`;
}

export const currentUser: User = {
  id: 'user-1',
  name: 'Maria Silva',
  username: 'mariasilva',
  avatar: generateAvatar('Maria Silva'),
  bio: 'Católica apaixonada pela Eucaristia. Membro da Pastoral da Juventude. 🙏',
  city: 'São Paulo',
  state: 'SP',
  country: 'Brasil',
  patronSaint: 'Nossa Senhora Aparecida',
  parish: 'Paróquia São José',
  diocese: 'Diocese de São Miguel Paulista',
  interests: ['Teologia', 'Música Sacra', 'Evangelização', 'Caridade'],
  joinedAt: '2024-01-15',
  friendsCount: 234,
  followersCount: 567,
  followingCount: 189,
};

export const users: User[] = [
  currentUser,
  {
    id: 'user-2',
    name: 'Pe. João Carlos',
    username: 'pe.joaocarlos',
    avatar: generateAvatar('Pe. João Carlos'),
    bio: 'Pároco da Paróquia São José. Pregador e diretor espiritual.',
    city: 'São Paulo',
    state: 'SP',
    country: 'Brasil',
    patronSaint: 'São José',
    parish: 'Paróquia São José',
    diocese: 'Diocese de São Miguel Paulista',
    interests: ['Teologia', 'Sagrada Escritura', 'Liturgia'],
    joinedAt: '2024-01-10',
    friendsCount: 1200,
    followersCount: 3400,
    followingCount: 45,
    isVerified: true,
    role: 'PRIEST',
  },
  {
    id: 'user-3',
    name: 'Ana Beatriz Costa',
    username: 'anabeatriz',
    avatar: generateAvatar('Ana Beatriz Costa'),
    bio: 'Catequista e missionária. Amante da arte sacra.',
    city: 'Rio de Janeiro',
    state: 'RJ',
    country: 'Brasil',
    patronSaint: 'Santa Teresinha',
    interests: ['Catequese', 'Arte Sacra', 'Missões'],
    joinedAt: '2024-02-01',
    friendsCount: 156,
    followersCount: 289,
    followingCount: 134,
  },
  {
    id: 'user-4',
    name: 'Lucas Ferreira',
    username: 'lucasferreira',
    avatar: generateAvatar('Lucas Ferreira'),
    bio: 'Jovem católico. Grupo de oração RCC. 🕊️',
    city: 'Belo Horizonte',
    state: 'MG',
    country: 'Brasil',
    patronSaint: 'São Francisco de Assis',
    interests: ['RCC', 'Música', 'Oração'],
    joinedAt: '2024-01-20',
    friendsCount: 89,
    followersCount: 201,
    followingCount: 67,
  },
  {
    id: 'user-5',
    name: 'Diocese de São Miguel Paulista',
    username: 'diocese.smp',
    avatar: generateAvatar('Diocese SMP'),
    bio: 'Perfil oficial da Diocese de São Miguel Paulista.',
    city: 'São Paulo',
    state: 'SP',
    country: 'Brasil',
    patronSaint: 'São Miguel Arcanjo',
    interests: ['Evangelização', 'Formação', 'Pastoral'],
    joinedAt: '2024-01-01',
    friendsCount: 5600,
    followersCount: 12000,
    followingCount: 23,
    isVerified: true,
    role: 'DIOCESE_ADMIN',
  },
  {
    id: 'user-6',
    name: 'Pedro Henrique Santos',
    username: 'pedrohs',
    avatar: generateAvatar('Pedro Henrique'),
    bio: 'Ministro de música. Servo do Senhor.',
    city: 'Curitiba',
    state: 'PR',
    country: 'Brasil',
    patronSaint: 'São Pedro',
    interests: ['Música Sacra', 'Liturgia', 'Composição'],
    joinedAt: '2024-02-15',
    friendsCount: 345,
    followersCount: 890,
    followingCount: 210,
  },
  {
    id: 'user-7',
    name: 'Carolina Mendes',
    username: 'carolmendes',
    avatar: generateAvatar('Carolina Mendes'),
    bio: 'Teóloga. Escritora. Apaixonada pelos Padres da Igreja.',
    city: 'Salvador',
    state: 'BA',
    country: 'Brasil',
    patronSaint: 'Santa Catarina de Sena',
    interests: ['Teologia', 'Patrologia', 'Escrita'],
    joinedAt: '2024-03-01',
    friendsCount: 432,
    followersCount: 1200,
    followingCount: 156,
  },
];

export const posts: Post[] = [
  {
    id: 'post-1',
    author: users[1],
    content: '🙏 Reflexão do Evangelho de hoje:\n\n"Vinde a mim, todos os que estais cansados e sobrecarregados, e eu vos darei descanso." (Mt 11,28)\n\nNeste tempo de graça, que possamos encontrar em Cristo o verdadeiro descanso para nossas almas. Não carreguem sozinhos o peso do mundo. Entreguem tudo ao Senhor.',
    likes: 234,
    comments: 45,
    shares: 12,
    visibility: 'PUBLIC',
    createdAt: '2024-12-15T08:30:00Z',
    liked: true,
  },
  {
    id: 'post-2',
    author: users[2],
    content: 'Hoje na catequese, as crianças fizeram lindos desenhos sobre a criação do mundo. A inocência e a pureza delas nos lembram do Reino de Deus! 🌈✝️\n\n#Catequese #Fé #EducaçãoNaFé',
    image: 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400"><rect width="600" height="400" fill="#e0f2fe"/><circle cx="300" cy="150" r="60" fill="#fbbf24"/><rect x="100" y="250" width="400" height="100" fill="#86efac" rx="10"/><text x="300" y="310" text-anchor="middle" fill="#166534" font-size="20" font-family="Inter">Alegria da Catequese</text></svg>'),
    likes: 89,
    comments: 23,
    shares: 5,
    visibility: 'PUBLIC',
    createdAt: '2024-12-15T14:20:00Z',
  },
  {
    id: 'post-3',
    author: users[3],
    content: 'Grupo de oração de hoje foi MARAVILHOSO! 🕊️🔥\n\nO Espírito Santo se fez presente de forma muito forte. Tivemos momentos de louvor, oração em línguas e uma palavra profética muito forte para a juventude.\n\nQuem estiver precisando de renovação, venha conosco! Toda quarta às 20h.',
    likes: 156,
    comments: 34,
    shares: 8,
    visibility: 'PUBLIC',
    createdAt: '2024-12-14T22:15:00Z',
    liked: true,
  },
  {
    id: 'post-4',
    author: users[4],
    content: '📢 COMUNICADO DIOCESANO\n\nA Diocese de São Miguel Paulista convoca todos os fiéis para a Festa de São Miguel Arcanjo, padroeiro da nossa Diocese.\n\n📅 Data: 29 de setembro\n📍 Local: Catedral São Miguel Arcanjo\n🕐 Horário: Missa Solene às 19h\n\nParticipem! Será um momento especial de graça e comunhão.',
    likes: 567,
    comments: 89,
    shares: 234,
    visibility: 'PUBLIC',
    createdAt: '2024-12-14T10:00:00Z',
  },
  {
    id: 'post-5',
    author: users[5],
    content: '🎵 Nova composição para a liturgia!\n\n"Teu amor, Senhor, é para sempre"\n\nQue esta música possa tocar os corações e elevar nossas almas ao Pai. Disponível no nosso canal.\n\n#MúsicaSacra #Liturgia #ComposiçãoCatólica',
    likes: 345,
    comments: 56,
    shares: 78,
    visibility: 'PUBLIC',
    createdAt: '2024-12-13T16:45:00Z',
  },
  {
    id: 'post-6',
    author: users[6],
    content: '📖 Dica de leitura: "Confissões" de Santo Agostinho\n\nUma das obras mais belas da literatura cristã. Agostinho nos mostra que não importa quão longe tenhamos nos afastado, a graça de Deus sempre nos alcança.\n\n"Tarde Te amei, ó Beleza tão antiga e tão nova, tarde Te amei!"\n\nQuem já leu? Compartilhem suas reflexões! 📚',
    likes: 278,
    comments: 67,
    shares: 34,
    visibility: 'PUBLIC',
    createdAt: '2024-12-13T09:30:00Z',
    liked: true,
  },
];

export const communities: Community[] = [
  {
    id: 'comm-1',
    name: 'Jovens Católicos',
    description: 'Comunidade para jovens católicos compartilharem fé, experiências e crescerem juntos na caminhada com Cristo.',
    avatar: generateAvatar('Jovens Católicos'),
    members: 12500,
    type: 'PUBLIC',
    category: 'Juventude',
    isMember: true,
  },
  {
    id: 'comm-2',
    name: 'Estudos Teológicos',
    description: 'Espaço para discussões teológicas, partilha de estudos e aprofundamento na fé católica.',
    avatar: generateAvatar('Estudos Teológicos'),
    members: 8900,
    type: 'PUBLIC',
    category: 'Formação',
    isMember: true,
  },
  {
    id: 'comm-3',
    name: 'Música Sacra Brasil',
    description: 'Para músicos, cantores e amantes da música sacra católica. Partilhas, composições e eventos.',
    avatar: generateAvatar('Música Sacra'),
    members: 5600,
    type: 'PUBLIC',
    category: 'Música',
    isMember: false,
  },
  {
    id: 'comm-4',
    name: 'Padres da Igreja',
    description: 'Estudo e partilha sobre os escritos dos Padres da Igreja e a Tradição Católica.',
    avatar: generateAvatar('Padres da Igreja'),
    members: 4300,
    type: 'PUBLIC',
    category: 'Formação',
    isMember: false,
  },
  {
    id: 'comm-5',
    name: 'Pastoral da Família',
    description: 'Comunidade para famílias católicas. Apoio, formação e partilha de experiências.',
    avatar: generateAvatar('Pastoral Família'),
    members: 7800,
    type: 'PUBLIC',
    category: 'Pastoral',
    isMember: true,
  },
  {
    id: 'comm-6',
    name: 'Adoradores Eucarísticos',
    description: 'Para aqueles que amam a Adoração Eucarística. Horários, testemunhos e reflexões.',
    avatar: generateAvatar('Adoradores'),
    members: 9200,
    type: 'PUBLIC',
    category: 'Espiritualidade',
    isMember: false,
  },
];

export const events: Event[] = [
  {
    id: 'evt-1',
    title: 'Missa do Galo - Natal',
    description: 'Celebração solene da Missa do Galo na Vigília de Natal. Venha celebrar o nascimento do Salvador conosco!',
    location: 'Paróquia São José - São Paulo/SP',
    startAt: '2024-12-24T23:00:00Z',
    endAt: '2024-12-25T01:00:00Z',
    organizer: users[1],
    type: 'MISSA',
    visibility: 'PUBLIC',
    capacity: 500,
    attendees: 345,
    status: 'UPCOMING',
  },
  {
    id: 'evt-2',
    title: 'Retiro de Advento',
    description: 'Retiro espiritual de Advento para preparação do Natal. Pregações, adoração e confissões disponíveis.',
    location: 'Casa de Retiros São José - Atibaia/SP',
    startAt: '2024-12-20T18:00:00Z',
    endAt: '2024-12-22T12:00:00Z',
    organizer: users[1],
    type: 'RETIRIO',
    visibility: 'PUBLIC',
    capacity: 200,
    attendees: 187,
    status: 'UPCOMING',
  },
  {
    id: 'evt-3',
    title: 'Terço dos Homens',
    description: 'Encontro mensal de oração do terço para homens. Momento de fé, fraternidade e oração.',
    location: 'Paróquia Nossa Senhora do Rosário',
    startAt: '2024-12-18T20:00:00Z',
    endAt: '2024-12-18T21:30:00Z',
    organizer: { name: 'Comunidade Terço dos Homens', avatar: generateAvatar('Terço Homens') },
    type: 'TERCO',
    visibility: 'PUBLIC',
    attendees: 89,
    status: 'UPCOMING',
  },
  {
    id: 'evt-4',
    title: 'Adoração Eucarística Noturna',
    description: 'Noite de Adoração ao Santíssimo Sacramento. Das 22h às 6h da manhã.',
    location: 'Catedral São Miguel Arcanjo',
    startAt: '2024-12-21T22:00:00Z',
    endAt: '2024-12-22T06:00:00Z',
    organizer: users[4],
    type: 'ADORACAO',
    visibility: 'PUBLIC',
    capacity: 300,
    attendees: 156,
    status: 'UPCOMING',
  },
  {
    id: 'evt-5',
    title: 'Encontro de Casais',
    description: 'Encontro de formação e espiritualidade para casais. Jantares, palestras e momentos de oração.',
    location: 'Salão Paroquial - Paróquia São José',
    startAt: '2024-12-28T19:00:00Z',
    endAt: '2024-12-28T22:00:00Z',
    organizer: users[1],
    type: 'ENCONTRO',
    visibility: 'PUBLIC',
    capacity: 100,
    attendees: 67,
    status: 'UPCOMING',
  },
];

export const prayerIntentions: PrayerIntention[] = [
  {
    id: 'prayer-1',
    author: users[2],
    content: 'Peço orações pela saúde da minha avó que está internada. Que Deus a cure e dê forças a toda nossa família.',
    prayersCount: 89,
    isPraying: true,
    createdAt: '2024-12-15T07:00:00Z',
    visibility: 'PUBLIC',
  },
  {
    id: 'prayer-2',
    author: users[3],
    content: 'Orem pela paz em nossas famílias. Que o Espírito Santo nos guie e nos dê sabedoria em todos os momentos.',
    prayersCount: 156,
    createdAt: '2024-12-14T18:30:00Z',
    visibility: 'PUBLIC',
  },
  {
    id: 'prayer-3',
    author: users[6],
    content: 'Peço orações por vocações sacerdotais e religiosas. Que o Senhor chame muitos jovens ao Seu serviço.',
    prayersCount: 234,
    isPraying: true,
    createdAt: '2024-12-14T10:00:00Z',
    visibility: 'PUBLIC',
  },
  {
    id: 'prayer-4',
    author: users[0],
    content: 'Rezem pelos jovens que estão se preparando para a crisma. Que o Espírito Santo os ilumine.',
    prayersCount: 67,
    createdAt: '2024-12-13T15:00:00Z',
    visibility: 'PUBLIC',
  },
];

export const parishes: Parish[] = [
  {
    id: 'parish-1',
    name: 'Paróquia São José',
    diocese: 'Diocese de São Miguel Paulista',
    address: 'Rua São José, 123 - Centro',
    city: 'São Paulo',
    state: 'SP',
    phone: '(11) 2345-6789',
    website: 'www.parquiasaojose.com.br',
    massSchedule: ['Seg a Sex: 7h e 19h', 'Sáb: 8h e 18h', 'Dom: 7h, 9h, 11h, 18h'],
    avatar: generateAvatar('P. São José'),
    isVerified: true,
  },
  {
    id: 'parish-2',
    name: 'Paróquia Nossa Senhora Aparecida',
    diocese: 'Diocese de São Miguel Paulista',
    address: 'Av. Aparecida, 456',
    city: 'São Paulo',
    state: 'SP',
    phone: '(11) 2456-7890',
    massSchedule: ['Seg a Sex: 6h30 e 19h30', 'Sáb: 17h', 'Dom: 7h, 9h30, 18h'],
    avatar: generateAvatar('P. N.S.Aparecida'),
    isVerified: true,
  },
  {
    id: 'parish-3',
    name: 'Catedral São Miguel Arcanjo',
    diocese: 'Diocese de São Miguel Paulista',
    address: 'Praça Catedral, 1',
    city: 'São Paulo',
    state: 'SP',
    phone: '(11) 2567-8901',
    website: 'www.catedralsmp.com.br',
    massSchedule: ['Seg a Sex: 7h e 18h', 'Sáb: 9h e 17h', 'Dom: 7h, 10h, 12h, 17h, 19h'],
    avatar: generateAvatar('Catedral'),
    isVerified: true,
  },
  {
    id: 'parish-4',
    name: 'Paróquia Sagrado Coração de Jesus',
    diocese: 'Diocese de São Miguel Paulista',
    address: 'Rua do Coração, 789',
    city: 'São Paulo',
    state: 'SP',
    phone: '(11) 2678-9012',
    massSchedule: ['Terça a Sexta: 19h', 'Sáb: 18h', 'Dom: 8h, 10h, 19h'],
    avatar: generateAvatar('P. Sag. Coração'),
    isVerified: true,
  },
];

export const conversations: Conversation[] = [
  {
    id: 'conv-1',
    participants: [users[1]],
    lastMessage: 'Que a paz de Cristo esteja com você! Até domingo na missa.',
    lastMessageAt: '2024-12-15T10:30:00Z',
    unread: 2,
    isGroup: false,
  },
  {
    id: 'conv-2',
    participants: [users[2], users[3]],
    lastMessage: 'Vamos combinar o encontro do grupo?',
    lastMessageAt: '2024-12-15T09:15:00Z',
    unread: 5,
    isGroup: true,
    groupName: 'Grupo de Oração',
  },
  {
    id: 'conv-3',
    participants: [users[5]],
    lastMessage: 'Obrigado pela partilha da música! Ficou linda!',
    lastMessageAt: '2024-12-14T20:00:00Z',
    unread: 0,
    isGroup: false,
  },
  {
    id: 'conv-4',
    participants: [users[6]],
    lastMessage: 'Li o livro que você indicou. Muito bom!',
    lastMessageAt: '2024-12-14T15:30:00Z',
    unread: 1,
    isGroup: false,
  },
];

export const notifications: Notification[] = [
  {
    id: 'notif-1',
    type: 'POST_LIKE',
    from: users[1],
    content: 'gostou da sua publicação',
    createdAt: '2024-12-15T10:00:00Z',
    read: false,
  },
  {
    id: 'notif-2',
    type: 'FRIEND_REQUEST',
    from: users[5],
    content: 'enviou um pedido de amizade',
    createdAt: '2024-12-15T09:30:00Z',
    read: false,
  },
  {
    id: 'notif-3',
    type: 'PRAYER_SUPPORT',
    from: users[6],
    content: 'está rezando pela sua intenção de oração',
    createdAt: '2024-12-15T08:00:00Z',
    read: false,
  },
  {
    id: 'notif-4',
    type: 'POST_COMMENT',
    from: users[2],
    content: 'comentou na sua publicação: "Amém! Que lindo!"',
    createdAt: '2024-12-14T22:00:00Z',
    read: true,
  },
  {
    id: 'notif-5',
    type: 'NEW_FOLLOWER',
    from: users[3],
    content: 'começou a seguir você',
    createdAt: '2024-12-14T18:00:00Z',
    read: true,
  },
  {
    id: 'notif-6',
    type: 'EVENT_REMINDER',
    from: users[4],
    content: 'Retiro de Advento começa em 5 dias',
    createdAt: '2024-12-14T10:00:00Z',
    read: true,
  },
  {
    id: 'notif-7',
    type: 'COMMUNITY_INVITE',
    from: users[6],
    content: 'convidou você para a comunidade "Padres da Igreja"',
    createdAt: '2024-12-13T14:00:00Z',
    read: true,
  },
];

export function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'agora';
  if (diffMins < 60) return `${diffMins}min`;
  if (diffHours < 24) return `${diffHours}h`;
  if (diffDays < 7) return `${diffDays}d`;
  return date.toLocaleDateString('pt-BR');
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

export function formatDateTime(dateString: string): string {
  return new Date(dateString).toLocaleString('pt-BR', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}
