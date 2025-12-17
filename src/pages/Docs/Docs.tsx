import { useState } from 'react';
import {
  BookOpen,
  Search,
  MessageCircle,
  Users,
  Settings,
  Shield,
  Zap,
  Code,
  ChevronRight,
  ExternalLink,
  Copy,
  Download,
  FileText,
  Video,
  Terminal,
  GitBranch,
  Cloud,
  Smartphone,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';

const Docs = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSection, setActiveSection] = useState('getting-started');

  const sections = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: <BookOpen className="w-5 h-5" />,
      items: [
        { title: 'Installation', icon: <Download className="w-4 h-4" /> },
        { title: 'Quick Start Guide', icon: <Zap className="w-4 h-4" /> },
        { title: 'Account Setup', icon: <Users className="w-4 h-4" /> },
        { title: 'Basic Concepts', icon: <AlertCircle className="w-4 h-4" /> }
      ]
    },
    {
      id: 'features',
      title: 'Features',
      icon: <Zap className="w-5 h-5" />,
      items: [
        { title: 'Real-time Chat', icon: <MessageCircle className="w-4 h-4" /> },
        { title: 'Virtual Classrooms', icon: <Users className="w-4 h-4" /> },
        { title: 'Smart Notes', icon: <FileText className="w-4 h-4" /> },
        { title: 'AI Summaries', icon: <Terminal className="w-4 h-4" /> }
      ]
    },
    {
      id: 'api',
      title: 'API Reference',
      icon: <Code className="w-5 h-5" />,
      items: [
        { title: 'Authentication', icon: <Shield className="w-4 h-4" /> },
        { title: 'Endpoints', icon: <GitBranch className="w-4 h-4" /> },
        { title: 'Webhooks', icon: <Cloud className="w-4 h-4" /> },
        { title: 'Rate Limits', icon: <AlertCircle className="w-4 h-4" /> }
      ]
    },
    {
      id: 'tutorials',
      title: 'Tutorials',
      icon: <Video className="w-5 h-5" />,
      items: [
        { title: 'Video Guides', icon: <Video className="w-4 h-4" /> },
        { title: 'Step-by-Step Examples', icon: <CheckCircle className="w-4 h-4" /> },
        { title: 'Best Practices', icon: <BookOpen className="w-4 h-4" /> },
        { title: 'Troubleshooting', icon: <Settings className="w-4 h-4" /> }
      ]
    }
  ];

  const filteredSections = sections.map(section => ({
    ...section,
    items: section.items.filter(item =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(section => section.items.length > 0);

  const renderContent = () => {
    switch (activeSection) {
      case 'getting-started':
        return (
          <div className="space-y-8">
            <div className="glass-panel rounded-2xl p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'oklch(0.55 0.08 145 / 0.1)' }}>
                  <BookOpen className="w-6 h-6" style={{ color: 'oklch(0.55 0.08 145)' }} />
                </div>
                <div>
                  <h2 className="zen-title text-2xl">Getting Started with zenWhisper</h2>
                  <p className="text-sidebar-foreground/70">Everything you need to know to get started</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="glass-panel rounded-xl p-6 hover:scale-105 transition-all cursor-pointer">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: 'oklch(0.55 0.08 145 / 0.1)' }}>
                    <Users className="w-5 h-5" style={{ color: 'oklch(0.55 0.08 145)' }} />
                  </div>
                  <h3 className="text-lg font-semibold text-sidebar-foreground mb-2">Create Your Account</h3>
                  <p className="text-sm text-sidebar-foreground/60 mb-4">
                    Sign up in seconds with your email and start collaborating immediately.
                  </p>
                  <a href="/signup" className="text-sm text-primary hover:text-primary/80 transition-colors flex items-center gap-1">
                    Get Started <ChevronRight className="w-3 h-3" />
                  </a>
                </div>

                <div className="glass-panel rounded-xl p-6 hover:scale-105 transition-all cursor-pointer">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: 'oklch(0.55 0.08 145 / 0.1)' }}>
                    <MessageCircle className="w-5 h-5" style={{ color: 'oklch(0.55 0.08 145)' }} />
                  </div>
                  <h3 className="text-lg font-semibold text-sidebar-foreground mb-2">Join Your First Classroom</h3>
                  <p className="text-sm text-sidebar-foreground/60 mb-4">
                    Connect with teachers and classmates in virtual classrooms.
                  </p>
                  <a href="/group" className="text-sm text-primary hover:text-primary/80 transition-colors flex items-center gap-1">
                    Explore Classrooms <ChevronRight className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>

            <div className="glass-panel rounded-2xl p-8">
              <h3 className="text-xl font-semibold text-sidebar-foreground mb-6">Quick Start Steps</h3>
              <div className="space-y-6">
                {[
                  { step: 1, title: 'Sign Up', desc: 'Create your account with email and password' },
                  { step: 2, title: 'Complete Profile', desc: 'Add your username and avatar' },
                  { step: 3, title: 'Join Classrooms', desc: 'Enter classroom codes or create new ones' },
                  { step: 4, title: 'Start Collaborating', desc: 'Chat, share notes, and learn together' }
                ].map((item) => (
                  <div key={item.step} className="flex gap-4">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium text-primary-foreground flex-shrink-0" style={{ backgroundColor: 'oklch(0.55 0.08 145)' }}>
                      {item.step}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sidebar-foreground font-medium">{item.title}</h4>
                      <p className="text-sm text-sidebar-foreground/60">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'features':
        return (
          <div className="space-y-8">
            <div className="glass-panel rounded-2xl p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'oklch(0.55 0.08 145 / 0.1)' }}>
                  <Zap className="w-6 h-6" style={{ color: 'oklch(0.55 0.08 145)' }} />
                </div>
                <div>
                  <h2 className="zen-title text-2xl">Powerful Features</h2>
                  <p className="text-sidebar-foreground/70">Discover what makes zenWhisper special</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    icon: <MessageCircle className="w-6 h-6" />,
                    title: 'Real-time Messaging',
                    desc: 'Instant chat with typing indicators and read receipts',
                    badge: 'New'
                  },
                  {
                    icon: <Users className="w-6 h-6" />,
                    title: 'Virtual Classrooms',
                    desc: 'Create and join collaborative learning spaces'
                  },
                  {
                    icon: <FileText className="w-6 h-6" />,
                    title: 'Smart Notes',
                    desc: 'Organize and share study materials with ease'
                  },
                  {
                    icon: <Terminal className="w-6 h-6" />,
                    title: 'AI Summaries',
                    desc: 'Get AI-generated summaries of lectures and content'
                  },
                  {
                    icon: <Shield className="w-6 h-6" />,
                    title: 'Privacy First',
                    desc: 'End-to-end encryption for all communications'
                  },
                  {
                    icon: <Smartphone className="w-6 h-6" />,
                    title: 'Cross Platform',
                    desc: 'Available on web, mobile, and desktop'
                  }
                ].map((feature, idx) => (
                  <div key={idx} className="glass-panel rounded-xl p-6 hover:scale-105 transition-all">
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: 'oklch(0.55 0.08 145 / 0.1)' }}>
                      <span style={{ color: 'oklch(0.55 0.08 145)' }}>{feature.icon}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-sidebar-foreground mb-2">
                      {feature.title}
                      {feature.badge && (
                        <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-primary/20 text-primary">
                          {feature.badge}
                        </span>
                      )}
                    </h3>
                    <p className="text-sm text-sidebar-foreground/60">{feature.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'api':
        return (
          <div className="space-y-8">
            <div className="glass-panel rounded-2xl p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'oklch(0.55 0.08 145 / 0.1)' }}>
                  <Code className="w-6 h-6" style={{ color: 'oklch(0.55 0.08 145)' }} />
                </div>
                <div>
                  <h2 className="zen-title text-2xl">API Reference</h2>
                  <p className="text-sidebar-foreground/70">Integrate zenWhisper into your applications</p>
                </div>
              </div>

              <div className="glass-panel rounded-xl p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-sidebar-foreground">Base URL</h3>
                  <button className="p-2 hover:bg-sidebar-accent/20 rounded-lg transition-colors">
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
                <code className="block p-4 bg-sidebar-accent/50 rounded-lg text-sm font-mono">
                  https://api.zenwhisper.com/v1
                </code>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-sidebar-foreground mb-4">Authentication</h3>
                  <p className="text-sidebar-foreground/70 mb-4">
                    All API requests must include your API key in the Authorization header:
                  </p>
                  <div className="glass-panel rounded-xl p-4 overflow-x-auto">
                    <pre className="text-sm">
                      <code>{`Authorization: Bearer YOUR_API_KEY`}</code>
                    </pre>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-sidebar-foreground mb-4">Example Request</h3>
                  <div className="glass-panel rounded-xl p-4 overflow-x-auto">
                    <pre className="text-sm">
                      <code>{`curl -X POST https://api.zenwhisper.com/v1/messages \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"message": "Hello World", "roomId": "12345"}'`}</code>
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'tutorials':
        return (
          <div className="space-y-8">
            <div className="glass-panel rounded-2xl p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'oklch(0.55 0.08 145 / 0.1)' }}>
                  <Video className="w-6 h-6" style={{ color: 'oklch(0.55 0.08 145)' }} />
                </div>
                <div>
                  <h2 className="zen-title text-2xl">Video Tutorials</h2>
                  <p className="text-sidebar-foreground/70">Learn by watching step-by-step guides</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {[
                  {
                    title: 'Getting Started',
                    duration: '5:23',
                    desc: 'Complete walkthrough of the basics',
                    level: 'Beginner'
                  },
                  {
                    title: 'Advanced Chat Features',
                    duration: '8:15',
                    desc: 'Master real-time messaging',
                    level: 'Intermediate'
                  },
                  {
                    title: 'Classroom Management',
                    duration: '10:42',
                    desc: 'Create and manage virtual classrooms',
                    level: 'Advanced'
                  },
                  {
                    title: 'AI Tools Integration',
                    duration: '7:30',
                    desc: 'Leverage AI for better learning',
                    level: 'Intermediate'
                  }
                ].map((video, idx) => (
                  <div key={idx} className="glass-panel rounded-xl p-6 hover:scale-105 transition-all cursor-pointer">
                    <div className="aspect-video bg-sidebar-accent/30 rounded-lg mb-4 flex items-center justify-center">
                      <Video className="w-8 h-8 text-sidebar-foreground/40" />
                    </div>
                    <h3 className="text-sidebar-foreground font-medium mb-2">{video.title}</h3>
                    <div className="flex items-center justify-between text-sm text-sidebar-foreground/60">
                      <span>{video.duration}</span>
                      <span className="px-2 py-0.5 rounded-full bg-sidebar-accent/50">{video.level}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen zen-pattern">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="zen-title text-4xl mb-2">Documentation</h1>
          <p className="text-sidebar-foreground/70">Complete guide to zenWhisper</p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-sidebar-foreground/40" />
            <input
              type="text"
              placeholder="Search documentation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 zen-search rounded-xl text-sidebar-foreground placeholder-sidebar-foreground/40"
            />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:w-80">
            <div className="glass-panel rounded-2xl p-6 sticky top-8">
              <nav className="space-y-6">
                {filteredSections.map((section) => (
                  <div key={section.id}>
                    <button
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all mb-2 ${
                        activeSection === section.id
                          ? 'bg-primary text-primary-foreground shadow-lg'
                          : 'text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/20'
                      }`}
                    >
                      {section.icon}
                      <span className="font-medium">{section.title}</span>
                    </button>
                    {activeSection === section.id && (
                      <div className="ml-4 space-y-1">
                        {section.items.map((item, idx) => (
                          <a
                            key={idx}
                            href="#"
                            className="flex items-center gap-2 px-3 py-2 text-sm text-sidebar-foreground/60 hover:text-sidebar-foreground/80 rounded-lg transition-colors"
                          >
                            {item.icon}
                            {item.title}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </nav>

              <div className="mt-8 pt-8 border-t border-sidebar-border">
                <div className="space-y-3">
                  <a
                    href="https://github.com/zenwhisper"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-4 py-3 text-sidebar-foreground/70 hover:text-sidebar-foreground rounded-xl transition-colors"
                  >
                    <GitBranch className="w-4 h-4" />
                    <span>GitHub</span>
                    <ExternalLink className="w-3 h-3 ml-auto" />
                  </a>
                  <a
                    href="/support"
                    className="flex items-center gap-3 px-4 py-3 text-sidebar-foreground/70 hover:text-sidebar-foreground rounded-xl transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Support</span>
                    <ExternalLink className="w-3 h-3 ml-auto" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 max-w-4xl">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Docs;