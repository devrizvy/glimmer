import { useState } from 'react';
import {
  HelpCircle,
  Search,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  MessageCircle,
  Users,
  Shield,
  Zap,
  CreditCard,
  Smartphone,
  Globe,
  Settings,
  BookOpen,
  Mail,
  AlertCircle,
  ExternalLink
} from 'lucide-react';

const FAQ = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Questions', icon: <HelpCircle className="w-4 h-4" /> },
    { id: 'getting-started', name: 'Getting Started', icon: <Zap className="w-4 h-4" /> },
    { id: 'features', name: 'Features', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'account', name: 'Account & Billing', icon: <CreditCard className="w-4 h-4" /> },
    { id: 'technical', name: 'Technical Support', icon: <Settings className="w-4 h-4" /> },
    { id: 'privacy', name: 'Privacy & Security', icon: <Shield className="w-4 h-4" /> }
  ];

  const faqs = [
    {
      id: 1,
      category: 'getting-started',
      question: 'How do I create an account on zenWhisper?',
      answer: 'Creating an account is simple! Click on the "Sign Up" button on the homepage, enter your email, choose a username and password, and verify your email address. The whole process takes less than 2 minutes.',
      icon: <Zap className="w-5 h-5" />
    },
    {
      id: 2,
      category: 'getting-started',
      question: 'Is zenWhisper free to use?',
      answer: 'Yes! zenWhisper offers a free tier with all essential features for students and teachers. We also have premium plans with additional features like unlimited storage, advanced AI tools, and priority support.',
      icon: <CreditCard className="w-5 h-5" />
    },
    {
      id: 3,
      category: 'features',
      question: 'What features does zenWhisper offer?',
      answer: 'zenWhisper provides real-time chat, virtual classrooms, smart notes, AI-powered summaries, file sharing, video calls, and collaborative tools. All designed specifically for educational environments.',
      icon: <BookOpen className="w-5 h-5" />
    },
    {
      id: 4,
      category: 'features',
      question: 'Can I create multiple classrooms?',
      answer: 'Absolutely! Teachers and students can create and join unlimited classrooms. Each classroom has its own chat, notes, and member management features.',
      icon: <Users className="w-5 h-5" />
    },
    {
      id: 5,
      category: 'features',
      question: 'How does the AI summary feature work?',
      answer: 'Our AI analyzes your lecture notes, chat messages, and shared documents to generate concise summaries. It identifies key concepts, main topics, and important points to help you study more efficiently.',
      icon: <Zap className="w-5 h-5" />
    },
    {
      id: 6,
      category: 'account',
      question: 'How do I reset my password?',
      answer: 'Click on "Forgot Password" on the login page, enter your email address, and we\'ll send you a password reset link. The link expires after 24 hours for security reasons.',
      icon: <Shield className="w-5 h-5" />
    },
    {
      id: 7,
      category: 'account',
      question: 'Can I change my username?',
      answer: 'Yes, you can change your username once every 30 days in your account settings. Go to Settings > Profile > Edit Username.',
      icon: <Settings className="w-5 h-5" />
    },
    {
      id: 8,
      category: 'account',
      question: 'How do I cancel my subscription?',
      answer: 'You can cancel your subscription anytime from your account settings. Go to Settings > Billing > Manage Subscription. Your access will continue until the end of your billing period.',
      icon: <CreditCard className="w-5 h-5" />
    },
    {
      id: 9,
      category: 'technical',
      question: 'What browsers does zenWhisper support?',
      answer: 'zenWhisper works best on the latest versions of Chrome, Firefox, Safari, and Edge. We recommend keeping your browser updated for the best experience and security.',
      icon: <Globe className="w-5 h-5" />
    },
    {
      id: 10,
      category: 'technical',
      question: 'Is there a mobile app available?',
      answer: 'Yes! zenWhisper is available on both iOS and Android. You can download it from the App Store or Google Play Store. Your data syncs seamlessly across all devices.',
      icon: <Smartphone className="w-5 h-5" />
    },
    {
      id: 11,
      category: 'technical',
      question: 'How much storage do I get?',
      answer: 'Free accounts get 5GB of storage. Premium accounts get unlimited storage for notes, files, and chat history. You can always upgrade your plan if you need more space.',
      icon: <BookOpen className="w-5 h-5" />
    },
    {
      id: 12,
      category: 'privacy',
      question: 'Is my data secure?',
      answer: 'Absolutely! We use end-to-end encryption for all messages and files. Your data is stored securely in SOC 2 compliant data centers, and we never sell your information to third parties.',
      icon: <Shield className="w-5 h-5" />
    },
    {
      id: 13,
      category: 'privacy',
      question: 'Who can see my messages?',
      answer: 'Only the participants in your chat or classroom can see the messages. Teachers in classrooms have access to all classroom communications for moderation purposes.',
      icon: <MessageCircle className="w-5 h-5" />
    },
    {
      id: 14,
      category: 'privacy',
      question: 'Can I delete my account?',
      answer: 'Yes, you can delete your account anytime from Settings > Privacy > Delete Account. This will permanently remove all your data, and the action cannot be undone.',
      icon: <AlertCircle className="w-5 h-5" />
    }
  ];

  const filteredFAQs = faqs.filter(faq => {
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleExpand = (id: number) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  return (
    <div className="min-h-screen zen-pattern">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 glass-panel rounded-2xl flex items-center justify-center mx-auto mb-6 zen-float">
            <HelpCircle className="w-10 h-10" style={{ color: 'oklch(0.55 0.08 145)' }} />
          </div>
          <h1 className="zen-title text-4xl sm:text-5xl mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-sidebar-foreground/70 max-w-2xl mx-auto">
            Find answers to common questions about zenWhisper
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-sidebar-foreground/40" />
            <input
              type="text"
              placeholder="Search for answers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 zen-search rounded-xl text-sidebar-foreground placeholder-sidebar-foreground/40 text-lg"
            />
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
                activeCategory === category.id
                  ? 'bg-primary text-primary-foreground shadow-lg'
                  : 'text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/20'
              }`}
            >
              {category.icon}
              <span>{category.name}</span>
            </button>
          ))}
        </div>

        {/* FAQ Items */}
        <div className="max-w-4xl mx-auto">
          {filteredFAQs.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 glass-panel rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-sidebar-foreground/40" />
              </div>
              <h3 className="text-xl font-semibold text-sidebar-foreground mb-2">
                No matching questions found
              </h3>
              <p className="text-sidebar-foreground/60 mb-4">
                Try different search terms or browse all categories
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('all');
                }}
                className="px-6 py-2 zen-action-btn text-primary-foreground rounded-xl transition-all"
                style={{
                  background: 'oklch(0.55 0.08 145)',
                  boxShadow: '0 4px 20px oklch(0.55 0.08 145 / 0.3)'
                }}
              >
                Browse All Questions
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredFAQs.map((faq) => (
                <div
                  key={faq.id}
                  className="glass-panel rounded-2xl overflow-hidden transition-all hover:scale-[1.02]"
                >
                  <button
                    onClick={() => toggleExpand(faq.id)}
                    className="w-full px-6 py-4 flex items-center justify-between text-left"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: 'oklch(0.55 0.08 145 / 0.1)' }}
                      >
                        <span style={{ color: 'oklch(0.55 0.08 145)' }}>{faq.icon}</span>
                      </div>
                      <h3 className="text-lg font-medium text-sidebar-foreground">
                        {faq.question}
                      </h3>
                    </div>
                    <div className="ml-4">
                      {expandedItems.has(faq.id) ? (
                        <ChevronUp className="w-5 h-5 text-sidebar-foreground/40" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-sidebar-foreground/40" />
                      )}
                    </div>
                  </button>

                  {expandedItems.has(faq.id) && (
                    <div className="px-6 pb-4 border-t border-sidebar-border/50">
                      <p className="text-sidebar-foreground/80 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Contact Support */}
        <div className="mt-16 glass-panel rounded-3xl p-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="w-16 h-16 glass-panel rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Mail className="w-8 h-8" style={{ color: 'oklch(0.55 0.08 145)' }} />
            </div>
            <h2 className="zen-title text-2xl mb-4">
              Still have questions?
            </h2>
            <p className="text-lg text-sidebar-foreground/70 mb-8 max-w-2xl mx-auto">
              Our support team is here to help you 24/7. Get in touch with us through any of the following channels.
            </p>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="p-6 hover:bg-sidebar-accent/20 rounded-xl transition-colors">
                <MessageCircle className="w-8 h-8 mx-auto mb-3" style={{ color: 'oklch(0.55 0.08 145)' }} />
                <h3 className="text-sidebar-foreground font-medium mb-2">Live Chat</h3>
                <p className="text-sm text-sidebar-foreground/60 mb-3">Chat with our support team instantly</p>
                <button className="text-primary hover:text-primary/80 transition-colors text-sm font-medium flex items-center gap-1 mx-auto">
                  Start Chat <ChevronRight className="w-3 h-3" />
                </button>
              </div>

              <div className="p-6 hover:bg-sidebar-accent/20 rounded-xl transition-colors">
                <Mail className="w-8 h-8 mx-auto mb-3" style={{ color: 'oklch(0.55 0.08 145)' }} />
                <h3 className="text-sidebar-foreground font-medium mb-2">Email Support</h3>
                <p className="text-sm text-sidebar-foreground/60 mb-3">Get detailed help via email</p>
                <a
                  href="mailto:support@zenwhisper.com"
                  className="text-primary hover:text-primary/80 transition-colors text-sm font-medium flex items-center gap-1 mx-auto"
                >
                  support@zenwhisper.com <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div className="p-6 hover:bg-sidebar-accent/20 rounded-xl transition-colors">
                <BookOpen className="w-8 h-8 mx-auto mb-3" style={{ color: 'oklch(0.55 0.08 145)' }} />
                <h3 className="text-sidebar-foreground font-medium mb-2">Help Center</h3>
                <p className="text-sm text-sidebar-foreground/60 mb-3">Browse our detailed guides</p>
                <a
                  href="/docs"
                  className="text-primary hover:text-primary/80 transition-colors text-sm font-medium flex items-center gap-1 mx-auto"
                >
                  Visit Help Center <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;