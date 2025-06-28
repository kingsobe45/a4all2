import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, 
  Hash, 
  Play, 
  BookOpen, 
  ShoppingCart, 
  Users, 
  MessageSquare, 
  Calendar, 
  DollarSign, 
  BarChart3,
  ExternalLink,
  Fire,
  Eye,
  Heart,
  Share2,
  Clock,
  Star,
  Download,
  Globe,
  Youtube,
  Twitter,
  Instagram,
  Search,
  Filter,
  RefreshCw,
  Zap,
  Crown,
  Target,
  Gamepad2,
  Brain,
  Sparkles
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface TrendingTopic {
  id: string;
  name: string;
  category: string;
  description: string;
  icon: string;
  color: string;
  trending: boolean;
  hashtags: {
    twitter: string[];
    instagram: string[];
  };
  videos: {
    title: string;
    creator: string;
    views: string;
    duration: string;
    thumbnail: string;
    url: string;
    uploadDate: string;
  }[];
  articles: {
    title: string;
    source: string;
    url: string;
    publishDate: string;
    readTime: string;
    summary: string;
  }[];
  purchaseLinks: {
    platform: string;
    price: string;
    url: string;
    discount?: string;
  }[];
  influencers: {
    name: string;
    platform: string;
    followers: string;
    avatar: string;
    verified: boolean;
    recentPost: string;
  }[];
  viralPosts: {
    platform: string;
    content: string;
    engagement: string;
    author: string;
    timestamp: string;
  }[];
  events: {
    title: string;
    date: string;
    type: string;
    description: string;
  }[];
  communities: {
    name: string;
    platform: string;
    members: string;
    activity: string;
    url: string;
  }[];
  priceDeals: {
    item: string;
    originalPrice: string;
    salePrice: string;
    discount: string;
    platform: string;
    endsAt: string;
  }[];
  statistics: {
    label: string;
    value: string;
    change: string;
    trend: 'up' | 'down' | 'stable';
  }[];
}

const trendingTopics: TrendingTopic[] = [
  {
    id: 'minecraft',
    name: 'Minecraft',
    category: 'Gaming',
    description: 'The world\'s best-selling video game continues to dominate with new updates, mods, and community content',
    icon: '🎮',
    color: '#4CAF50',
    trending: true,
    hashtags: {
      twitter: ['#Minecraft', '#MinecraftUpdate', '#MinecraftBuilds', '#MinecraftMods', '#MinecraftLive'],
      instagram: ['#minecraft', '#minecraftbuilds', '#minecraftart', '#minecraftmemes', '#minecraftcreations']
    },
    videos: [
      {
        title: 'Minecraft 1.21 Update: Everything You Need to Know',
        creator: 'Dream',
        views: '12.5M',
        duration: '18:42',
        thumbnail: 'https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg?auto=compress&cs=tinysrgb&w=400',
        url: '#',
        uploadDate: '2024-01-20'
      },
      {
        title: 'Building the ULTIMATE Minecraft Castle',
        creator: 'Grian',
        views: '8.3M',
        duration: '24:15',
        thumbnail: 'https://images.pexels.com/photos/1670977/pexels-photo-1670977.jpeg?auto=compress&cs=tinysrgb&w=400',
        url: '#',
        uploadDate: '2024-01-18'
      },
      {
        title: 'Minecraft But Every Block is Random',
        creator: 'MrBeast Gaming',
        views: '15.7M',
        duration: '12:33',
        thumbnail: 'https://images.pexels.com/photos/8439093/pexels-photo-8439093.jpeg?auto=compress&cs=tinysrgb&w=400',
        url: '#',
        uploadDate: '2024-01-15'
      }
    ],
    articles: [
      {
        title: 'Minecraft Education Edition Transforms Learning in 2024',
        source: 'TechCrunch',
        url: '#',
        publishDate: '2024-01-22',
        readTime: '5 min',
        summary: 'How Minecraft is revolutionizing education with new features and classroom integration tools.'
      },
      {
        title: 'The Psychology Behind Minecraft\'s Endless Appeal',
        source: 'Wired',
        url: '#',
        publishDate: '2024-01-19',
        readTime: '8 min',
        summary: 'Exploring why Minecraft continues to captivate players across all age groups after 15 years.'
      }
    ],
    purchaseLinks: [
      {
        platform: 'Minecraft.net',
        price: '$26.95',
        url: '#',
        discount: '15% off'
      },
      {
        platform: 'Steam',
        price: '$29.99',
        url: '#'
      },
      {
        platform: 'Microsoft Store',
        price: '$26.95',
        url: '#'
      }
    ],
    influencers: [
      {
        name: 'Dream',
        platform: 'YouTube',
        followers: '31.2M',
        avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100',
        verified: true,
        recentPost: 'New Minecraft manhunt video coming this weekend! 🔥'
      },
      {
        name: 'Grian',
        platform: 'YouTube',
        followers: '8.1M',
        avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=100',
        verified: true,
        recentPost: 'Working on the biggest Hermitcraft build yet!'
      },
      {
        name: 'TommyInnit',
        platform: 'Twitch',
        followers: '7.2M',
        avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=100',
        verified: true,
        recentPost: 'Live streaming Minecraft with friends tonight at 8PM GMT'
      }
    ],
    viralPosts: [
      {
        platform: 'Twitter',
        content: 'Someone recreated the entire Earth in Minecraft with 1:1 scale. This is insane! 🌍',
        engagement: '2.3M likes, 890K retweets',
        author: '@MinecraftDaily',
        timestamp: '2 hours ago'
      },
      {
        platform: 'TikTok',
        content: 'Building a working computer inside Minecraft using redstone',
        engagement: '15.7M views, 3.2M likes',
        author: '@RedstoneGenius',
        timestamp: '1 day ago'
      }
    ],
    events: [
      {
        title: 'Minecraft Live 2024',
        date: '2024-10-15',
        type: 'Official Event',
        description: 'Annual Minecraft event showcasing new updates and community highlights'
      },
      {
        title: 'MineCon Community Convention',
        date: '2024-08-20',
        type: 'Community Event',
        description: 'Fan-organized convention celebrating Minecraft culture and creativity'
      }
    ],
    communities: [
      {
        name: 'r/Minecraft',
        platform: 'Reddit',
        members: '7.2M',
        activity: 'Very High',
        url: '#'
      },
      {
        name: 'Minecraft Official Discord',
        platform: 'Discord',
        members: '2.8M',
        activity: 'High',
        url: '#'
      },
      {
        name: 'Planet Minecraft',
        platform: 'Website',
        members: '15M+',
        activity: 'High',
        url: '#'
      }
    ],
    priceDeals: [
      {
        item: 'Minecraft Java Edition',
        originalPrice: '$29.99',
        salePrice: '$23.99',
        discount: '20%',
        platform: 'Humble Bundle',
        endsAt: '2024-02-01'
      },
      {
        item: 'Minecraft Dungeons',
        originalPrice: '$19.99',
        salePrice: '$9.99',
        discount: '50%',
        platform: 'Epic Games',
        endsAt: '2024-01-30'
      }
    ],
    statistics: [
      {
        label: 'Monthly Active Players',
        value: '140M+',
        change: '+5.2%',
        trend: 'up'
      },
      {
        label: 'YouTube Views (30 days)',
        value: '2.8B',
        change: '+12.4%',
        trend: 'up'
      },
      {
        label: 'Twitch Hours Watched',
        value: '45.2M',
        change: '+8.1%',
        trend: 'up'
      }
    ]
  },
  {
    id: 'ai-chatbots',
    name: 'AI Chatbots & LLMs',
    category: 'Technology',
    description: 'Revolutionary AI language models transforming how we interact with technology and information',
    icon: '🤖',
    color: '#2196F3',
    trending: true,
    hashtags: {
      twitter: ['#AI', '#ChatGPT', '#LLM', '#ArtificialIntelligence', '#MachineLearning'],
      instagram: ['#ai', '#artificialintelligence', '#chatgpt', '#technology', '#futuretech']
    },
    videos: [
      {
        title: 'GPT-4 vs Claude vs Gemini: Ultimate AI Comparison 2024',
        creator: 'Marques Brownlee',
        views: '8.9M',
        duration: '16:28',
        thumbnail: 'https://images.pexels.com/photos/8386434/pexels-photo-8386434.jpeg?auto=compress&cs=tinysrgb&w=400',
        url: '#',
        uploadDate: '2024-01-21'
      },
      {
        title: 'I Used AI to Run My Entire Business for 30 Days',
        creator: 'Ali Abdaal',
        views: '5.2M',
        duration: '22:15',
        thumbnail: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=400',
        url: '#',
        uploadDate: '2024-01-19'
      },
      {
        title: 'The AI Revolution: What Happens Next?',
        creator: 'Veritasium',
        views: '12.1M',
        duration: '28:42',
        thumbnail: 'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=400',
        url: '#',
        uploadDate: '2024-01-17'
      }
    ],
    articles: [
      {
        title: 'OpenAI Announces GPT-5: The Next Leap in AI Intelligence',
        source: 'The Verge',
        url: '#',
        publishDate: '2024-01-23',
        readTime: '6 min',
        summary: 'Breaking down the capabilities and implications of OpenAI\'s latest language model.'
      },
      {
        title: 'How AI Chatbots Are Transforming Customer Service',
        source: 'Harvard Business Review',
        url: '#',
        publishDate: '2024-01-20',
        readTime: '10 min',
        summary: 'Analysis of AI adoption in enterprise customer support and its business impact.'
      }
    ],
    purchaseLinks: [
      {
        platform: 'ChatGPT Plus',
        price: '$20/month',
        url: '#'
      },
      {
        platform: 'Claude Pro',
        price: '$20/month',
        url: '#'
      },
      {
        platform: 'GitHub Copilot',
        price: '$10/month',
        url: '#'
      }
    ],
    influencers: [
      {
        name: 'Sam Altman',
        platform: 'Twitter',
        followers: '2.1M',
        avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100',
        verified: true,
        recentPost: 'Excited to share what we\'re building next at OpenAI 🚀'
      },
      {
        name: 'Andrej Karpathy',
        platform: 'Twitter',
        followers: '890K',
        avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=100',
        verified: true,
        recentPost: 'New neural network architecture paper just dropped!'
      },
      {
        name: 'Lex Fridman',
        platform: 'YouTube',
        followers: '3.2M',
        avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=100',
        verified: true,
        recentPost: 'Interviewing leading AI researchers about the future of AGI'
      }
    ],
    viralPosts: [
      {
        platform: 'Twitter',
        content: 'ChatGPT just helped me debug code, write a poem, and plan my vacation. We\'re living in the future! 🤯',
        engagement: '1.8M likes, 450K retweets',
        author: '@TechEnthusiast',
        timestamp: '4 hours ago'
      },
      {
        platform: 'LinkedIn',
        content: 'AI productivity tools increased our team efficiency by 300%. Here\'s how we did it...',
        engagement: '890K views, 45K reactions',
        author: 'Sarah Chen, CEO',
        timestamp: '1 day ago'
      }
    ],
    events: [
      {
        title: 'AI Safety Summit 2024',
        date: '2024-11-01',
        type: 'Conference',
        description: 'Global summit on AI safety, governance, and responsible development'
      },
      {
        title: 'OpenAI DevDay',
        date: '2024-09-15',
        type: 'Developer Event',
        description: 'Annual developer conference showcasing new AI tools and APIs'
      }
    ],
    communities: [
      {
        name: 'r/MachineLearning',
        platform: 'Reddit',
        members: '2.8M',
        activity: 'Very High',
        url: '#'
      },
      {
        name: 'AI/ML Twitter',
        platform: 'Twitter',
        members: '5M+',
        activity: 'Very High',
        url: '#'
      },
      {
        name: 'Hugging Face Community',
        platform: 'Website',
        members: '1.2M',
        activity: 'High',
        url: '#'
      }
    ],
    priceDeals: [
      {
        item: 'ChatGPT Plus Annual',
        originalPrice: '$240/year',
        salePrice: '$200/year',
        discount: '17%',
        platform: 'OpenAI',
        endsAt: '2024-02-15'
      },
      {
        item: 'AI Course Bundle',
        originalPrice: '$299',
        salePrice: '$99',
        discount: '67%',
        platform: 'Udemy',
        endsAt: '2024-01-31'
      }
    ],
    statistics: [
      {
        label: 'ChatGPT Weekly Users',
        value: '100M+',
        change: '+25.3%',
        trend: 'up'
      },
      {
        label: 'AI Job Postings',
        value: '2.5M',
        change: '+180%',
        trend: 'up'
      },
      {
        label: 'AI Startup Funding',
        value: '$25.2B',
        change: '+76%',
        trend: 'up'
      }
    ]
  },
  {
    id: 'sustainable-tech',
    name: 'Sustainable Technology',
    category: 'Environment',
    description: 'Green technology innovations driving the transition to a sustainable future',
    icon: '🌱',
    color: '#4CAF50',
    trending: true,
    hashtags: {
      twitter: ['#SustainableTech', '#GreenTech', '#CleanEnergy', '#Sustainability', '#ClimateAction'],
      instagram: ['#sustainabletech', '#greentech', '#cleanenergy', '#sustainability', '#ecofriendly']
    },
    videos: [
      {
        title: 'Revolutionary Solar Panel Technology Breakthrough 2024',
        creator: 'Undecided with Matt Ferrell',
        views: '3.2M',
        duration: '14:32',
        thumbnail: 'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=400',
        url: '#',
        uploadDate: '2024-01-22'
      },
      {
        title: 'Electric Vehicle Battery Recycling: The Complete Process',
        creator: 'Real Engineering',
        views: '2.8M',
        duration: '18:45',
        thumbnail: 'https://images.pexels.com/photos/8439093/pexels-photo-8439093.jpeg?auto=compress&cs=tinysrgb&w=400',
        url: '#',
        uploadDate: '2024-01-20'
      },
      {
        title: 'Carbon Capture Technology: Hope or Hype?',
        creator: 'Kurzgesagt',
        views: '6.7M',
        duration: '11:28',
        thumbnail: 'https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&cs=tinysrgb&w=400',
        url: '#',
        uploadDate: '2024-01-18'
      }
    ],
    articles: [
      {
        title: 'Breakthrough in Fusion Energy Brings Clean Power Closer',
        source: 'Nature',
        url: '#',
        publishDate: '2024-01-24',
        readTime: '7 min',
        summary: 'Scientists achieve new milestone in nuclear fusion, promising unlimited clean energy.'
      },
      {
        title: 'The Rise of Vertical Farming: Feeding Cities Sustainably',
        source: 'MIT Technology Review',
        url: '#',
        publishDate: '2024-01-21',
        readTime: '9 min',
        summary: 'How vertical farming technology is revolutionizing urban agriculture and food security.'
      }
    ],
    purchaseLinks: [
      {
        platform: 'Tesla Solar',
        price: 'From $15,000',
        url: '#'
      },
      {
        platform: 'Rivian R1T',
        price: '$73,000',
        url: '#',
        discount: '$7,500 tax credit'
      },
      {
        platform: 'Sustainable Tech ETF',
        price: '$45.20/share',
        url: '#'
      }
    ],
    influencers: [
      {
        name: 'Elon Musk',
        platform: 'Twitter',
        followers: '170M',
        avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100',
        verified: true,
        recentPost: 'Sustainable energy is the future. Mars needs to be powered by renewables too! 🚀'
      },
      {
        name: 'Bill Gates',
        platform: 'LinkedIn',
        followers: '35M',
        avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=100',
        verified: true,
        recentPost: 'Investing in breakthrough energy technologies to combat climate change'
      },
      {
        name: 'Greta Thunberg',
        platform: 'Instagram',
        followers: '14.8M',
        avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=100',
        verified: true,
        recentPost: 'Technology alone won\'t save us, but it\'s a crucial part of the solution'
      }
    ],
    viralPosts: [
      {
        platform: 'Twitter',
        content: 'This new solar panel is 47% efficient and costs 60% less to manufacture. Game changer! ☀️',
        engagement: '890K likes, 234K retweets',
        author: '@CleanTechNews',
        timestamp: '6 hours ago'
      },
      {
        platform: 'TikTok',
        content: 'Building a completely off-grid sustainable tiny house with cutting-edge tech',
        engagement: '8.2M views, 1.1M likes',
        author: '@SustainableLiving',
        timestamp: '2 days ago'
      }
    ],
    events: [
      {
        title: 'COP29 Climate Summit',
        date: '2024-11-11',
        type: 'Global Summit',
        description: 'UN Climate Change Conference focusing on sustainable technology solutions'
      },
      {
        title: 'Clean Energy Expo 2024',
        date: '2024-09-25',
        type: 'Trade Show',
        description: 'Largest renewable energy and sustainable technology exhibition'
      }
    ],
    communities: [
      {
        name: 'r/CleanTech',
        platform: 'Reddit',
        members: '450K',
        activity: 'High',
        url: '#'
      },
      {
        name: 'Sustainable Tech Alliance',
        platform: 'LinkedIn',
        members: '890K',
        activity: 'High',
        url: '#'
      },
      {
        name: 'CleanTechnica Community',
        platform: 'Website',
        members: '2.1M',
        activity: 'Very High',
        url: '#'
      }
    ],
    priceDeals: [
      {
        item: 'Home Solar Installation',
        originalPrice: '$25,000',
        salePrice: '$17,500',
        discount: '30%',
        platform: 'SunPower',
        endsAt: '2024-03-31'
      },
      {
        item: 'Electric Vehicle Charger',
        originalPrice: '$599',
        salePrice: '$399',
        discount: '33%',
        platform: 'ChargePoint',
        endsAt: '2024-02-15'
      }
    ],
    statistics: [
      {
        label: 'Clean Energy Investment',
        value: '$1.8T',
        change: '+17%',
        trend: 'up'
      },
      {
        label: 'EV Market Share',
        value: '18%',
        change: '+8.2%',
        trend: 'up'
      },
      {
        label: 'Renewable Energy Jobs',
        value: '13.7M',
        change: '+12.7%',
        trend: 'up'
      }
    ]
  }
];

export default function TrendingAnalysis() {
  const { currentTheme } = useTheme();
  const [selectedTopic, setSelectedTopic] = useState(trendingTopics[0]);
  const [activeSection, setActiveSection] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 2000);
  };

  const sections = [
    { id: 'overview', name: 'Overview', icon: TrendingUp },
    { id: 'hashtags', name: 'Hashtags', icon: Hash },
    { id: 'videos', name: 'Videos', icon: Play },
    { id: 'articles', name: 'Articles', icon: BookOpen },
    { id: 'purchase', name: 'Purchase', icon: ShoppingCart },
    { id: 'influencers', name: 'Influencers', icon: Users },
    { id: 'viral', name: 'Viral Posts', icon: Fire },
    { id: 'events', name: 'Events', icon: Calendar },
    { id: 'communities', name: 'Communities', icon: MessageSquare },
    { id: 'deals', name: 'Deals', icon: DollarSign },
    { id: 'stats', name: 'Statistics', icon: BarChart3 }
  ];

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 
            className="text-4xl md:text-5xl font-bold mb-4"
            style={{ 
              fontFamily: currentTheme.fonts.heading,
              color: currentTheme.colors.text
            }}
          >
            <span 
              className="bg-gradient-to-r bg-clip-text text-transparent"
              style={{ backgroundImage: currentTheme.gradients.button }}
            >
              📊 Trending Analysis
            </span>
          </h1>
          <p 
            className="text-xl mb-8"
            style={{ 
              color: currentTheme.colors.textSecondary,
              fontFamily: currentTheme.fonts.body
            }}
          >
            Comprehensive social media and online presence analysis for trending topics
          </p>

          {/* Refresh Button */}
          <motion.button
            onClick={handleRefresh}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center space-x-2 mx-auto px-6 py-3 rounded-xl font-medium transition-all duration-300"
            style={{
              background: currentTheme.gradients.button,
              color: '#ffffff',
              boxShadow: currentTheme.effects.glow
            }}
          >
            <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Refresh Data</span>
          </motion.button>
        </motion.div>

        {/* Topic Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {trendingTopics.map((topic, index) => (
              <motion.button
                key={topic.id}
                onClick={() => setSelectedTopic(topic)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-6 rounded-2xl text-left transition-all duration-300 ${
                  selectedTopic.id === topic.id ? 'ring-2' : ''
                }`}
                style={{
                  background: selectedTopic.id === topic.id 
                    ? currentTheme.gradients.card
                    : `${currentTheme.colors.surface}80`,
                  border: `1px solid ${selectedTopic.id === topic.id ? topic.color : currentTheme.colors.border}`,
                  ringColor: topic.color,
                  boxShadow: selectedTopic.id === topic.id ? currentTheme.effects.glow : 'none'
                }}
              >
                <div className="flex items-center space-x-3 mb-3">
                  <span className="text-3xl">{topic.icon}</span>
                  <div>
                    <h3 
                      className="text-xl font-bold"
                      style={{ 
                        color: currentTheme.colors.text,
                        fontFamily: currentTheme.fonts.heading
                      }}
                    >
                      {topic.name}
                    </h3>
                    <span 
                      className="text-sm px-2 py-1 rounded-lg"
                      style={{ 
                        background: `${topic.color}20`,
                        color: topic.color
                      }}
                    >
                      {topic.category}
                    </span>
                  </div>
                  {topic.trending && (
                    <div className="ml-auto">
                      <Fire className="w-5 h-5 text-orange-500" />
                    </div>
                  )}
                </div>
                <p 
                  className="text-sm"
                  style={{ 
                    color: currentTheme.colors.textSecondary,
                    fontFamily: currentTheme.fonts.body
                  }}
                >
                  {topic.description}
                </p>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Section Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex flex-wrap gap-2 justify-center">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <motion.button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all duration-300`}
                  style={{
                    background: activeSection === section.id 
                      ? currentTheme.gradients.button
                      : currentTheme.gradients.card,
                    color: activeSection === section.id 
                      ? '#ffffff'
                      : currentTheme.colors.text,
                    border: `1px solid ${activeSection === section.id ? 'transparent' : currentTheme.colors.border}`,
                    boxShadow: activeSection === section.id ? currentTheme.effects.glow : 'none'
                  }}
                >
                  <Icon className="w-4 h-4" />
                  <span>{section.name}</span>
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Content Sections */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${selectedTopic.id}-${activeSection}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Overview Section */}
            {activeSection === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Stats */}
                <div className="lg:col-span-2">
                  <div 
                    className="p-6 rounded-2xl mb-6"
                    style={{
                      background: currentTheme.gradients.card,
                      border: `1px solid ${currentTheme.colors.border}`
                    }}
                  >
                    <h2 
                      className="text-2xl font-bold mb-4"
                      style={{ 
                        color: currentTheme.colors.text,
                        fontFamily: currentTheme.fonts.heading
                      }}
                    >
                      {selectedTopic.name} Overview
                    </h2>
                    <p 
                      className="text-lg mb-6"
                      style={{ 
                        color: currentTheme.colors.textSecondary,
                        fontFamily: currentTheme.fonts.body
                      }}
                    >
                      {selectedTopic.description}
                    </p>
                    
                    {/* Quick Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {selectedTopic.statistics.slice(0, 6).map((stat, index) => (
                        <div 
                          key={index}
                          className="p-4 rounded-xl text-center"
                          style={{ 
                            background: `${selectedTopic.color}10`,
                            border: `1px solid ${selectedTopic.color}30`
                          }}
                        >
                          <div 
                            className="text-2xl font-bold"
                            style={{ color: currentTheme.colors.text }}
                          >
                            {stat.value}
                          </div>
                          <div 
                            className="text-sm"
                            style={{ color: currentTheme.colors.textSecondary }}
                          >
                            {stat.label}
                          </div>
                          <div className={`text-xs flex items-center justify-center mt-1 ${
                            stat.trend === 'up' ? 'text-green-500' : 
                            stat.trend === 'down' ? 'text-red-500' : 'text-gray-500'
                          }`}>
                            <TrendingUp className={`w-3 h-3 mr-1 ${
                              stat.trend === 'down' ? 'rotate-180' : ''
                            }`} />
                            {stat.change}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Trending Highlights */}
                <div>
                  <div 
                    className="p-6 rounded-2xl"
                    style={{
                      background: currentTheme.gradients.card,
                      border: `1px solid ${currentTheme.colors.border}`
                    }}
                  >
                    <h3 
                      className="text-xl font-bold mb-4"
                      style={{ 
                        color: currentTheme.colors.text,
                        fontFamily: currentTheme.fonts.heading
                      }}
                    >
                      🔥 Trending Now
                    </h3>
                    
                    {/* Top Hashtags */}
                    <div className="mb-6">
                      <h4 
                        className="text-sm font-medium mb-2"
                        style={{ color: currentTheme.colors.textSecondary }}
                      >
                        Top Hashtags
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedTopic.hashtags.twitter.slice(0, 3).map((hashtag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 rounded-lg text-xs font-medium"
                            style={{
                              background: `${selectedTopic.color}20`,
                              color: selectedTopic.color
                            }}
                          >
                            {hashtag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Top Video */}
                    <div className="mb-6">
                      <h4 
                        className="text-sm font-medium mb-2"
                        style={{ color: currentTheme.colors.textSecondary }}
                      >
                        Most Viewed Video
                      </h4>
                      <div 
                        className="p-3 rounded-lg"
                        style={{ background: `${currentTheme.colors.primary}10` }}
                      >
                        <div 
                          className="font-medium text-sm mb-1"
                          style={{ color: currentTheme.colors.text }}
                        >
                          {selectedTopic.videos[0].title}
                        </div>
                        <div 
                          className="text-xs"
                          style={{ color: currentTheme.colors.textSecondary }}
                        >
                          {selectedTopic.videos[0].views} views • {selectedTopic.videos[0].creator}
                        </div>
                      </div>
                    </div>

                    {/* Top Influencer */}
                    <div>
                      <h4 
                        className="text-sm font-medium mb-2"
                        style={{ color: currentTheme.colors.textSecondary }}
                      >
                        Top Influencer
                      </h4>
                      <div className="flex items-center space-x-3">
                        <img
                          src={selectedTopic.influencers[0].avatar}
                          alt={selectedTopic.influencers[0].name}
                          className="w-10 h-10 rounded-full"
                        />
                        <div>
                          <div 
                            className="font-medium text-sm"
                            style={{ color: currentTheme.colors.text }}
                          >
                            {selectedTopic.influencers[0].name}
                          </div>
                          <div 
                            className="text-xs"
                            style={{ color: currentTheme.colors.textSecondary }}
                          >
                            {selectedTopic.influencers[0].followers} followers
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Hashtags Section */}
            {activeSection === 'hashtags' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div 
                  className="p-6 rounded-2xl"
                  style={{
                    background: currentTheme.gradients.card,
                    border: `1px solid ${currentTheme.colors.border}`
                  }}
                >
                  <div className="flex items-center space-x-2 mb-4">
                    <Twitter className="w-6 h-6 text-blue-500" />
                    <h3 
                      className="text-xl font-bold"
                      style={{ 
                        color: currentTheme.colors.text,
                        fontFamily: currentTheme.fonts.heading
                      }}
                    >
                      Twitter Hashtags
                    </h3>
                  </div>
                  <div className="space-y-3">
                    {selectedTopic.hashtags.twitter.map((hashtag, index) => (
                      <div 
                        key={index}
                        className="flex items-center justify-between p-3 rounded-lg"
                        style={{ background: `${currentTheme.colors.primary}10` }}
                      >
                        <span 
                          className="font-medium"
                          style={{ color: currentTheme.colors.text }}
                        >
                          {hashtag}
                        </span>
                        <div className="flex items-center space-x-2">
                          <TrendingUp className="w-4 h-4 text-green-500" />
                          <span 
                            className="text-sm"
                            style={{ color: currentTheme.colors.textSecondary }}
                          >
                            {Math.floor(Math.random() * 500 + 100)}K posts
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div 
                  className="p-6 rounded-2xl"
                  style={{
                    background: currentTheme.gradients.card,
                    border: `1px solid ${currentTheme.colors.border}`
                  }}
                >
                  <div className="flex items-center space-x-2 mb-4">
                    <Instagram className="w-6 h-6 text-pink-500" />
                    <h3 
                      className="text-xl font-bold"
                      style={{ 
                        color: currentTheme.colors.text,
                        fontFamily: currentTheme.fonts.heading
                      }}
                    >
                      Instagram Hashtags
                    </h3>
                  </div>
                  <div className="space-y-3">
                    {selectedTopic.hashtags.instagram.map((hashtag, index) => (
                      <div 
                        key={index}
                        className="flex items-center justify-between p-3 rounded-lg"
                        style={{ background: `${currentTheme.colors.secondary}10` }}
                      >
                        <span 
                          className="font-medium"
                          style={{ color: currentTheme.colors.text }}
                        >
                          {hashtag}
                        </span>
                        <div className="flex items-center space-x-2">
                          <Heart className="w-4 h-4 text-red-500" />
                          <span 
                            className="text-sm"
                            style={{ color: currentTheme.colors.textSecondary }}
                          >
                            {Math.floor(Math.random() * 200 + 50)}K posts
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Videos Section */}
            {activeSection === 'videos' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {selectedTopic.videos.map((video, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="rounded-2xl overflow-hidden"
                    style={{
                      background: currentTheme.gradients.card,
                      border: `1px solid ${currentTheme.colors.border}`
                    }}
                  >
                    <div className="relative">
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <Play className="w-12 h-12 text-white" />
                      </div>
                      <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-sm">
                        {video.duration}
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 
                        className="font-semibold mb-2 line-clamp-2"
                        style={{ 
                          color: currentTheme.colors.text,
                          fontFamily: currentTheme.fonts.heading
                        }}
                      >
                        {video.title}
                      </h3>
                      <div 
                        className="text-sm mb-2"
                        style={{ color: currentTheme.colors.textSecondary }}
                      >
                        {video.creator}
                      </div>
                      <div className="flex items-center justify-between text-sm" style={{ color: currentTheme.colors.textSecondary }}>
                        <span className="flex items-center">
                          <Eye className="w-4 h-4 mr-1" />
                          {video.views}
                        </span>
                        <span>{video.uploadDate}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Articles Section */}
            {activeSection === 'articles' && (
              <div className="space-y-6">
                {selectedTopic.articles.map((article, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-6 rounded-2xl"
                    style={{
                      background: currentTheme.gradients.card,
                      border: `1px solid ${currentTheme.colors.border}`
                    }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 
                          className="text-xl font-semibold mb-2"
                          style={{ 
                            color: currentTheme.colors.text,
                            fontFamily: currentTheme.fonts.heading
                          }}
                        >
                          {article.title}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm mb-3" style={{ color: currentTheme.colors.textSecondary }}>
                          <span>{article.source}</span>
                          <span>{article.publishDate}</span>
                          <span className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {article.readTime}
                          </span>
                        </div>
                        <p 
                          className="text-sm"
                          style={{ 
                            color: currentTheme.colors.textSecondary,
                            fontFamily: currentTheme.fonts.body
                          }}
                        >
                          {article.summary}
                        </p>
                      </div>
                      <button 
                        className="ml-4 p-2 rounded-lg transition-colors"
                        style={{ 
                          background: `${currentTheme.colors.primary}20`,
                          color: currentTheme.colors.primary
                        }}
                      >
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Purchase Links Section */}
            {activeSection === 'purchase' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {selectedTopic.purchaseLinks.map((link, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-6 rounded-2xl text-center"
                    style={{
                      background: currentTheme.gradients.card,
                      border: `1px solid ${currentTheme.colors.border}`
                    }}
                  >
                    <ShoppingCart 
                      className="w-12 h-12 mx-auto mb-4"
                      style={{ color: selectedTopic.color }}
                    />
                    <h3 
                      className="text-xl font-bold mb-2"
                      style={{ 
                        color: currentTheme.colors.text,
                        fontFamily: currentTheme.fonts.heading
                      }}
                    >
                      {link.platform}
                    </h3>
                    <div 
                      className="text-2xl font-bold mb-2"
                      style={{ color: selectedTopic.color }}
                    >
                      {link.price}
                    </div>
                    {link.discount && (
                      <div 
                        className="text-sm mb-4 px-2 py-1 rounded-lg inline-block"
                        style={{ 
                          background: `${currentTheme.colors.accent}20`,
                          color: currentTheme.colors.accent
                        }}
                      >
                        {link.discount}
                      </div>
                    )}
                    <button 
                      className="w-full py-3 rounded-xl font-medium transition-all duration-300"
                      style={{
                        background: currentTheme.gradients.button,
                        color: '#ffffff'
                      }}
                    >
                      Visit Store
                    </button>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Influencers Section */}
            {activeSection === 'influencers' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {selectedTopic.influencers.map((influencer, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-6 rounded-2xl"
                    style={{
                      background: currentTheme.gradients.card,
                      border: `1px solid ${currentTheme.colors.border}`
                    }}
                  >
                    <div className="flex items-center space-x-3 mb-4">
                      <img
                        src={influencer.avatar}
                        alt={influencer.name}
                        className="w-16 h-16 rounded-full"
                      />
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 
                            className="text-lg font-bold"
                            style={{ 
                              color: currentTheme.colors.text,
                              fontFamily: currentTheme.fonts.heading
                            }}
                          >
                            {influencer.name}
                          </h3>
                          {influencer.verified && (
                            <Star className="w-4 h-4 text-blue-500" />
                          )}
                        </div>
                        <div 
                          className="text-sm"
                          style={{ color: currentTheme.colors.textSecondary }}
                        >
                          {influencer.platform} • {influencer.followers}
                        </div>
                      </div>
                    </div>
                    <div 
                      className="p-3 rounded-lg text-sm"
                      style={{ 
                        background: `${selectedTopic.color}10`,
                        color: currentTheme.colors.text
                      }}
                    >
                      "{influencer.recentPost}"
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Viral Posts Section */}
            {activeSection === 'viral' && (
              <div className="space-y-6">
                {selectedTopic.viralPosts.map((post, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-6 rounded-2xl"
                    style={{
                      background: currentTheme.gradients.card,
                      border: `1px solid ${currentTheme.colors.border}`
                    }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="p-2 rounded-full"
                          style={{ background: `${selectedTopic.color}20` }}
                        >
                          {post.platform === 'Twitter' && <Twitter className="w-5 h-5 text-blue-500" />}
                          {post.platform === 'TikTok' && <Play className="w-5 h-5 text-black" />}
                          {post.platform === 'LinkedIn' && <Users className="w-5 h-5 text-blue-700" />}
                        </div>
                        <div>
                          <div 
                            className="font-medium"
                            style={{ color: currentTheme.colors.text }}
                          >
                            {post.author}
                          </div>
                          <div 
                            className="text-sm"
                            style={{ color: currentTheme.colors.textSecondary }}
                          >
                            {post.platform} • {post.timestamp}
                          </div>
                        </div>
                      </div>
                      <Fire className="w-5 h-5 text-orange-500" />
                    </div>
                    <p 
                      className="text-lg mb-4"
                      style={{ 
                        color: currentTheme.colors.text,
                        fontFamily: currentTheme.fonts.body
                      }}
                    >
                      {post.content}
                    </p>
                    <div 
                      className="text-sm font-medium"
                      style={{ color: selectedTopic.color }}
                    >
                      {post.engagement}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Events Section */}
            {activeSection === 'events' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {selectedTopic.events.map((event, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-6 rounded-2xl"
                    style={{
                      background: currentTheme.gradients.card,
                      border: `1px solid ${currentTheme.colors.border}`
                    }}
                  >
                    <div className="flex items-start space-x-4">
                      <div 
                        className="p-3 rounded-xl"
                        style={{ background: `${selectedTopic.color}20` }}
                      >
                        <Calendar 
                          className="w-6 h-6"
                          style={{ color: selectedTopic.color }}
                        />
                      </div>
                      <div className="flex-1">
                        <h3 
                          className="text-xl font-bold mb-2"
                          style={{ 
                            color: currentTheme.colors.text,
                            fontFamily: currentTheme.fonts.heading
                          }}
                        >
                          {event.title}
                        </h3>
                        <div className="flex items-center space-x-4 mb-3 text-sm" style={{ color: currentTheme.colors.textSecondary }}>
                          <span>{event.date}</span>
                          <span 
                            className="px-2 py-1 rounded-lg"
                            style={{ 
                              background: `${currentTheme.colors.primary}20`,
                              color: currentTheme.colors.primary
                            }}
                          >
                            {event.type}
                          </span>
                        </div>
                        <p 
                          className="text-sm"
                          style={{ 
                            color: currentTheme.colors.textSecondary,
                            fontFamily: currentTheme.fonts.body
                          }}
                        >
                          {event.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Communities Section */}
            {activeSection === 'communities' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {selectedTopic.communities.map((community, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-6 rounded-2xl"
                    style={{
                      background: currentTheme.gradients.card,
                      border: `1px solid ${currentTheme.colors.border}`
                    }}
                  >
                    <div className="flex items-center space-x-3 mb-4">
                      <div 
                        className="p-2 rounded-full"
                        style={{ background: `${selectedTopic.color}20` }}
                      >
                        <MessageSquare 
                          className="w-5 h-5"
                          style={{ color: selectedTopic.color }}
                        />
                      </div>
                      <div>
                        <h3 
                          className="text-lg font-bold"
                          style={{ 
                            color: currentTheme.colors.text,
                            fontFamily: currentTheme.fonts.heading
                          }}
                        >
                          {community.name}
                        </h3>
                        <div 
                          className="text-sm"
                          style={{ color: currentTheme.colors.textSecondary }}
                        >
                          {community.platform}
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span style={{ color: currentTheme.colors.textSecondary }}>Members</span>
                        <span style={{ color: currentTheme.colors.text }}>{community.members}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span style={{ color: currentTheme.colors.textSecondary }}>Activity</span>
                        <span 
                          className={`font-medium ${
                            community.activity === 'Very High' ? 'text-green-500' :
                            community.activity === 'High' ? 'text-blue-500' : 'text-yellow-500'
                          }`}
                        >
                          {community.activity}
                        </span>
                      </div>
                    </div>
                    <button 
                      className="w-full py-2 rounded-lg font-medium transition-all duration-300"
                      style={{
                        background: `${selectedTopic.color}20`,
                        color: selectedTopic.color
                      }}
                    >
                      Join Community
                    </button>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Deals Section */}
            {activeSection === 'deals' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {selectedTopic.priceDeals.map((deal, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-6 rounded-2xl"
                    style={{
                      background: currentTheme.gradients.card,
                      border: `1px solid ${currentTheme.colors.border}`
                    }}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 
                          className="text-xl font-bold mb-2"
                          style={{ 
                            color: currentTheme.colors.text,
                            fontFamily: currentTheme.fonts.heading
                          }}
                        >
                          {deal.item}
                        </h3>
                        <div 
                          className="text-sm mb-2"
                          style={{ color: currentTheme.colors.textSecondary }}
                        >
                          {deal.platform}
                        </div>
                      </div>
                      <div 
                        className="px-3 py-1 rounded-lg text-sm font-bold"
                        style={{ 
                          background: currentTheme.colors.accent,
                          color: '#ffffff'
                        }}
                      >
                        -{deal.discount}
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 mb-4">
                      <span 
                        className="text-2xl font-bold"
                        style={{ color: selectedTopic.color }}
                      >
                        {deal.salePrice}
                      </span>
                      <span 
                        className="text-lg line-through"
                        style={{ color: currentTheme.colors.textSecondary }}
                      >
                        {deal.originalPrice}
                      </span>
                    </div>
                    <div 
                      className="text-sm mb-4"
                      style={{ color: currentTheme.colors.textSecondary }}
                    >
                      Ends: {deal.endsAt}
                    </div>
                    <button 
                      className="w-full py-3 rounded-xl font-medium transition-all duration-300"
                      style={{
                        background: currentTheme.gradients.button,
                        color: '#ffffff'
                      }}
                    >
                      Get Deal
                    </button>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Statistics Section */}
            {activeSection === 'stats' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {selectedTopic.statistics.map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-6 rounded-2xl text-center"
                    style={{
                      background: currentTheme.gradients.card,
                      border: `1px solid ${currentTheme.colors.border}`
                    }}
                  >
                    <BarChart3 
                      className="w-12 h-12 mx-auto mb-4"
                      style={{ color: selectedTopic.color }}
                    />
                    <div 
                      className="text-3xl font-bold mb-2"
                      style={{ color: currentTheme.colors.text }}
                    >
                      {stat.value}
                    </div>
                    <div 
                      className="text-lg font-medium mb-2"
                      style={{ color: currentTheme.colors.textSecondary }}
                    >
                      {stat.label}
                    </div>
                    <div className={`flex items-center justify-center text-sm ${
                      stat.trend === 'up' ? 'text-green-500' : 
                      stat.trend === 'down' ? 'text-red-500' : 'text-gray-500'
                    }`}>
                      <TrendingUp className={`w-4 h-4 mr-1 ${
                        stat.trend === 'down' ? 'rotate-180' : ''
                      }`} />
                      {stat.change}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}