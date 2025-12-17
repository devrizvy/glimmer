import { MessageCircle, Users, BookOpen, Brain, Sparkles, Shield, Zap, Target, GraduationCap, Lightbulb, Code, Heart } from 'lucide-react';

const About = () => {
  const features = [
    {
      icon: <MessageCircle className="w-6 h-6" />,
      title: "Real-time Chat",
      description: "Connect instantly with classmates and teachers through secure, private messaging."
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Virtual Classrooms",
      description: "Create and join collaborative group rooms for focused discussions and learning."
    },
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: "Smart Notes",
      description: "Organize, share, and collaborate on notes with intelligent formatting."
    },
    {
      icon: <Brain className="w-6 h-6" />,
      title: "AI-Powered Summary",
      description: "Get AI-generated summaries of your lectures and study materials instantly."
    }
  ];

  const values = [
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Privacy First",
      description: "Your data is encrypted and secure. We never share your information with third parties."
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Lightning Fast",
      description: "Real-time synchronization ensures your messages and updates are delivered instantly."
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Education Focused",
      description: "Built specifically for students and teachers to enhance the learning experience."
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Made with Care",
      description: "Designed by educators who understand the challenges of modern learning."
    }
  ];

  return (
    <div className="min-h-screen zen-pattern">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-[oklch(0.55_0.08_145/0.05)] to-transparent"></div>
        <div className="relative container mx-auto px-4 py-16 sm:py-24">
          <div className="text-center">
            <div className="w-20 h-20 glass-panel rounded-2xl flex items-center justify-center mx-auto mb-8 zen-float">
              <GraduationCap className="w-10 h-10" style={{ color: 'oklch(0.55 0.08 145)' }} />
            </div>
            <h1 className="zen-title text-5xl sm:text-6xl mb-6">
              About zenWhisper
            </h1>
            <p className="text-xl text-sidebar-foreground/80 max-w-3xl mx-auto leading-relaxed">
              Bridging the gap between students and teachers through intelligent, real-time collaboration.
              Experience the future of educational communication.
            </p>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="py-16 sm:py-20">
        <div className="container mx-auto px-4">
          <div className="glass-panel rounded-3xl p-8 sm:p-12 max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="w-16 h-16 glass-panel rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Target className="w-8 h-8" style={{ color: 'oklch(0.55 0.08 145)' }} />
              </div>
              <h2 className="zen-title text-3xl sm:text-4xl mb-4">Our Mission</h2>
              <p className="text-lg text-sidebar-foreground/70 leading-relaxed">
                To empower educators and students with a seamless digital platform that enhances learning,
                fosters collaboration, and makes education more accessible and engaging for everyone.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="text-center p-6">
                <div className="w-12 h-12 glass-panel rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6" style={{ color: 'oklch(0.55 0.08 145)' }} />
                </div>
                <h3 className="text-xl font-semibold text-sidebar-foreground mb-2">Connect</h3>
                <p className="text-sidebar-foreground/60">
                  Bring together students and teachers in a unified digital environment
                </p>
              </div>
              <div className="text-center p-6">
                <div className="w-12 h-12 glass-panel rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Lightbulb className="w-6 h-6" style={{ color: 'oklch(0.55 0.08 145)' }} />
                </div>
                <h3 className="text-xl font-semibold text-sidebar-foreground mb-2">Collaborate</h3>
                <p className="text-sidebar-foreground/60">
                  Enable real-time collaboration and knowledge sharing
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 sm:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="zen-title text-4xl sm:text-5xl mb-4">Powerful Features</h2>
            <p className="text-lg text-sidebar-foreground/70 max-w-2xl mx-auto">
              Everything you need to enhance your educational experience in one unified platform.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <div
                key={index}
                className="glass-panel rounded-2xl p-6 zen-ripple hover:scale-105 transition-all duration-300"
              >
                <div
                  className="w-12 h-12 glass-panel rounded-xl flex items-center justify-center mb-4"
                  style={{ color: 'oklch(0.55 0.08 145)' }}
                >
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-sidebar-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-sidebar-foreground/60 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="py-16 sm:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="w-16 h-16 glass-panel rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Sparkles className="w-8 h-8" style={{ color: 'oklch(0.55 0.08 145)' }} />
            </div>
            <h2 className="zen-title text-4xl sm:text-5xl mb-4">Our Values</h2>
            <p className="text-lg text-sidebar-foreground/70 max-w-2xl mx-auto">
              The principles that guide everything we do.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {values.map((value, index) => (
              <div key={index} className="text-center">
                <div
                  className="w-16 h-16 glass-panel rounded-2xl flex items-center justify-center mx-auto mb-4 zen-pulse"
                  style={{ color: 'oklch(0.55 0.08 145)' }}
                >
                  {value.icon}
                </div>
                <h3 className="text-xl font-semibold text-sidebar-foreground mb-3">
                  {value.title}
                </h3>
                <p className="text-sm text-sidebar-foreground/60 leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Technology Section */}
      <div className="py-16 sm:py-20">
        <div className="container mx-auto px-4">
          <div className="glass-panel rounded-3xl p-8 sm:p-12 max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="w-16 h-16 glass-panel rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Code className="w-8 h-8" style={{ color: 'oklch(0.55 0.08 145)' }} />
              </div>
              <h2 className="zen-title text-3xl sm:text-4xl mb-4">Built with Modern Technology</h2>
              <p className="text-lg text-sidebar-foreground/70 leading-relaxed">
                Leveraging cutting-edge web technologies to deliver a smooth, responsive, and reliable experience.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div className="p-6">
                <div className="text-2xl font-bold mb-2" style={{ color: 'oklch(0.55 0.08 145)' }}>
                  Real-time
                </div>
                <p className="text-sm text-sidebar-foreground/60">
                  WebSocket-powered instant messaging
                </p>
              </div>
              <div className="p-6">
                <div className="text-2xl font-bold mb-2" style={{ color: 'oklch(0.55 0.08 145)' }}>
                  Secure
                </div>
                <p className="text-sm text-sidebar-foreground/60">
                  End-to-end encryption for all communications
                </p>
              </div>
              <div className="p-6">
                <div className="text-2xl font-bold mb-2" style={{ color: 'oklch(0.55 0.08 145)' }}>
                  Scalable
                </div>
                <p className="text-sm text-sidebar-foreground/60">
                  Built to grow with your educational needs
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 sm:py-20">
        <div className="container mx-auto px-4">
          <div className="glass-panel rounded-3xl p-8 sm:p-12 text-center max-w-4xl mx-auto">
            <h2 className="zen-title text-3xl sm:text-4xl mb-4">
              Ready to Transform Your Learning Experience?
            </h2>
            <p className="text-lg text-sidebar-foreground/70 mb-8 max-w-2xl mx-auto">
              Join thousands of students and teachers who are already using zenWhisper to make education more collaborative and engaging.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                className="px-8 py-3 zen-action-btn text-primary-foreground rounded-xl font-medium transition-all"
                style={{
                  background: 'oklch(0.55 0.08 145)',
                  boxShadow: '0 4px 20px oklch(0.55 0.08 145 / 0.3)'
                }}
                onClick={() => window.location.href = '/signup'}
              >
                Get Started Free
              </button>
              <button
                className="px-8 py-3 glass-panel rounded-xl font-medium text-sidebar-foreground hover:bg-sidebar-accent/30 transition-all"
                onClick={() => window.location.href = '/login'}
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;