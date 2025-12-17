import { useState } from 'react';
import {
  User,
  Bell,
  Shield,
  Palette,
  ChevronRight,
  Moon,
  Sun,
  Wifi,
  Lock,
  Eye,
  Globe,
  MessageSquare,
  LogOut,
  Smartphone,
  Laptop,
  Download,
  Trash2,
  Save,
  RotateCcw,
  Users,
  Calendar as CalendarIcon,
} from 'lucide-react';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [autoSave, setAutoSave] = useState(true);

  const tabs = [
    { id: 'profile', label: 'Profile', icon: <User className="w-4 h-4" /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell className="w-4 h-4" /> },
    { id: 'privacy', label: 'Privacy & Security', icon: <Shield className="w-4 h-4" /> },
    { id: 'appearance', label: 'Appearance', icon: <Palette className="w-4 h-4" /> },
    { id: 'advanced', label: 'Advanced', icon: <Globe className="w-4 h-4" /> },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="space-y-6">
            <div className="glass-panel rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-sidebar-foreground">Profile Information</h3>
                <button className="text-primary hover:text-primary/80 transition-colors">
                  <User className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center border-2 border-primary/30">
                    <User className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-sidebar-foreground">John Doe</h4>
                    <p className="text-sm text-sidebar-foreground/60">john.doe@university.edu</p>
                    <button className="mt-2 text-sm text-primary hover:text-primary/80 transition-colors">
                      Change Avatar
                    </button>
                  </div>
                </div>

                <div className="space-y-4 pt-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-sidebar-foreground/60 mb-1 block">Username</label>
                      <input
                        type="text"
                        defaultValue="johndoe"
                        className="w-full px-3 py-2 zen-search rounded-lg text-sidebar-foreground"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-sidebar-foreground/60 mb-1 block">Email</label>
                      <input
                        type="email"
                        defaultValue="john.doe@university.edu"
                        className="w-full px-3 py-2 zen-search rounded-lg text-sidebar-foreground"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-sidebar-foreground/60 mb-1 block">Bio</label>
                    <textarea
                      rows={3}
                      placeholder="Tell us about yourself..."
                      className="w-full px-3 py-2 zen-search rounded-lg text-sidebar-foreground placeholder-sidebar-foreground/40 resize-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-panel rounded-2xl p-6">
              <h3 className="text-xl font-semibold text-sidebar-foreground mb-4">Learning Preferences</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 hover:bg-sidebar-accent/20 rounded-lg transition-colors">
                  <div>
                    <h4 className="text-sidebar-foreground">Study Reminders</h4>
                    <p className="text-sm text-sidebar-foreground/60">Get notified about study sessions</p>
                  </div>
                  <button
                    className={`w-12 h-6 rounded-full transition-colors ${
                      notifications ? 'bg-primary' : 'bg-sidebar-accent'
                    }`}
                    onClick={() => setNotifications(!notifications)}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                      notifications ? 'translate-x-6' : 'translate-x-0.5'
                    }`} />
                  </button>
                </div>
                <div className="flex items-center justify-between p-3 hover:bg-sidebar-accent/20 rounded-lg transition-colors">
                  <div>
                    <h4 className="text-sidebar-foreground">Auto-save Notes</h4>
                    <p className="text-sm text-sidebar-foreground/60">Automatically save your notes</p>
                  </div>
                  <button
                    className={`w-12 h-6 rounded-full transition-colors ${
                      autoSave ? 'bg-primary' : 'bg-sidebar-accent'
                    }`}
                    onClick={() => setAutoSave(!autoSave)}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                      autoSave ? 'translate-x-6' : 'translate-x-0.5'
                    }`} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-6">
            <div className="glass-panel rounded-2xl p-6">
              <h3 className="text-xl font-semibold text-sidebar-foreground mb-4">Notification Preferences</h3>
              <div className="space-y-4">
                {[
                  { icon: <MessageSquare className="w-4 h-4" />, title: 'Messages', desc: 'New messages and chat updates' },
                  { icon: <Users className="w-4 h-4" />, title: 'Classroom Activity', desc: 'New members and messages in classrooms' },
                  { icon: <CalendarIcon className="w-4 h-4" />, title: 'Study Sessions', desc: 'Reminders for scheduled study sessions' },
                  { icon: <Bell className="w-4 h-4" />, title: 'System Updates', desc: 'Important system announcements' },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 hover:bg-sidebar-accent/20 rounded-lg transition-colors">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: 'oklch(0.55 0.08 145 / 0.1)' }}
                      >
                        <span style={{ color: 'oklch(0.55 0.08 145)' }}>{item.icon}</span>
                      </div>
                      <div>
                        <h4 className="text-sidebar-foreground">{item.title}</h4>
                        <p className="text-sm text-sidebar-foreground/60">{item.desc}</p>
                      </div>
                    </div>
                    <button
                      className={`w-12 h-6 rounded-full transition-colors ${
                        notifications ? 'bg-primary' : 'bg-sidebar-accent'
                      }`}
                      onClick={() => setNotifications(!notifications)}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                        notifications ? 'translate-x-6' : 'translate-x-0.5'
                      }`} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-panel rounded-2xl p-6">
              <h3 className="text-xl font-semibold text-sidebar-foreground mb-4">Sound & Vibration</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sidebar-foreground">Sound Effects</h4>
                    <p className="text-sm text-sidebar-foreground/60">Play sounds for notifications</p>
                  </div>
                  <button
                    className={`w-12 h-6 rounded-full transition-colors ${
                      soundEnabled ? 'bg-primary' : 'bg-sidebar-accent'
                    }`}
                    onClick={() => setSoundEnabled(!soundEnabled)}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                      soundEnabled ? 'translate-x-6' : 'translate-x-0.5'
                    }`} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'privacy':
        return (
          <div className="space-y-6">
            <div className="glass-panel rounded-2xl p-6">
              <h3 className="text-xl font-semibold text-sidebar-foreground mb-4">Privacy Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 hover:bg-sidebar-accent/20 rounded-lg transition-colors">
                  <div className="flex items-center gap-3">
                    <Eye className="w-5 h-5 text-sidebar-foreground/60" />
                    <div>
                      <h4 className="text-sidebar-foreground">Profile Visibility</h4>
                      <p className="text-sm text-sidebar-foreground/60">Control who can see your profile</p>
                    </div>
                  </div>
                  <select className="px-3 py-1 zen-search rounded-lg text-sm">
                    <option>Everyone</option>
                    <option>Only Students</option>
                    <option>Private</option>
                  </select>
                </div>

                <div className="flex items-center justify-between p-4 hover:bg-sidebar-accent/20 rounded-lg transition-colors">
                  <div className="flex items-center gap-3">
                    <MessageSquare className="w-5 h-5 text-sidebar-foreground/60" />
                    <div>
                      <h4 className="text-sidebar-foreground">Message Requests</h4>
                      <p className="text-sm text-sidebar-foreground/60">Allow messages from anyone</p>
                    </div>
                  </div>
                  <button className="w-12 h-6 rounded-full bg-primary">
                    <div className="w-5 h-5 bg-white rounded-full translate-x-6" />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 hover:bg-sidebar-accent/20 rounded-lg transition-colors">
                  <div className="flex items-center gap-3">
                    <Wifi className="w-5 h-5 text-sidebar-foreground/60" />
                    <div>
                      <h4 className="text-sidebar-foreground">Online Status</h4>
                      <p className="text-sm text-sidebar-foreground/60">Show when you're online</p>
                    </div>
                  </div>
                  <button className="w-12 h-6 rounded-full bg-primary">
                    <div className="w-5 h-5 bg-white rounded-full translate-x-6" />
                  </button>
                </div>
              </div>
            </div>

            <div className="glass-panel rounded-2xl p-6">
              <h3 className="text-xl font-semibold text-sidebar-foreground mb-4">Security</h3>
              <div className="space-y-4">
                <button className="w-full flex items-center justify-between p-4 hover:bg-sidebar-accent/20 rounded-lg transition-colors group">
                  <div className="flex items-center gap-3">
                    <Lock className="w-5 h-5 text-sidebar-foreground/60" />
                    <div className="text-left">
                      <h4 className="text-sidebar-foreground">Change Password</h4>
                      <p className="text-sm text-sidebar-foreground/60">Update your password</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-sidebar-foreground/40 group-hover:text-sidebar-foreground/60" />
                </button>

                <button className="w-full flex items-center justify-between p-4 hover:bg-sidebar-accent/20 rounded-lg transition-colors group">
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-sidebar-foreground/60" />
                    <div className="text-left">
                      <h4 className="text-sidebar-foreground">Two-Factor Authentication</h4>
                      <p className="text-sm text-sidebar-foreground/60">Add an extra layer of security</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 text-xs rounded-full bg-sidebar-accent text-sidebar-foreground/60">
                    Not Enabled
                  </span>
                </button>

                <button className="w-full flex items-center justify-between p-4 hover:bg-sidebar-accent/20 rounded-lg transition-colors group">
                  <div className="flex items-center gap-3">
                    <Smartphone className="w-5 h-5 text-sidebar-foreground/60" />
                    <div className="text-left">
                      <h4 className="text-sidebar-foreground">Active Sessions</h4>
                      <p className="text-sm text-sidebar-foreground/60">Manage your logged-in devices</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-sidebar-foreground/40 group-hover:text-sidebar-foreground/60" />
                </button>
              </div>
            </div>
          </div>
        );

      case 'appearance':
        return (
          <div className="space-y-6">
            <div className="glass-panel rounded-2xl p-6">
              <h3 className="text-xl font-semibold text-sidebar-foreground mb-4">Theme</h3>
              <div className="space-y-4">
                <div className="grid md:grid-cols-3 gap-4">
                  <button
                    className={`p-4 rounded-xl border-2 transition-all ${
                      darkMode
                        ? 'border-primary bg-primary/10'
                        : 'border-sidebar-border hover:border-sidebar-foreground/20'
                    }`}
                    onClick={() => setDarkMode(true)}
                  >
                    <Moon className="w-6 h-6 mb-2 mx-auto" style={{ color: 'oklch(0.55 0.08 145)' }} />
                    <h4 className="text-sidebar-foreground">Dark Mode</h4>
                    <p className="text-xs text-sidebar-foreground/60 mt-1">Easy on the eyes</p>
                  </button>

                  <button
                    className={`p-4 rounded-xl border-2 transition-all ${
                      !darkMode
                        ? 'border-primary bg-primary/10'
                        : 'border-sidebar-border hover:border-sidebar-foreground/20'
                    }`}
                    onClick={() => setDarkMode(false)}
                  >
                    <Sun className="w-6 h-6 mb-2 mx-auto" style={{ color: 'oklch(0.55 0.08 145)' }} />
                    <h4 className="text-sidebar-foreground">Light Mode</h4>
                    <p className="text-xs text-sidebar-foreground/60 mt-1">Bright and clean</p>
                  </button>

                  <button className="p-4 rounded-xl border-2 border-sidebar-border hover:border-sidebar-foreground/20 transition-all">
                    <Laptop className="w-6 h-6 mb-2 mx-auto text-sidebar-foreground/60" />
                    <h4 className="text-sidebar-foreground">System</h4>
                    <p className="text-xs text-sidebar-foreground/60 mt-1">Follow your device</p>
                  </button>
                </div>
              </div>
            </div>

            <div className="glass-panel rounded-2xl p-6">
              <h3 className="text-xl font-semibold text-sidebar-foreground mb-4">Display</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-sidebar-foreground/60 mb-2 block">Font Size</label>
                  <div className="grid grid-cols-4 gap-2">
                    {['Small', 'Medium', 'Large', 'Extra Large'].map((size, idx) => (
                      <button
                        key={size}
                        className={`py-2 px-3 rounded-lg transition-all ${
                          idx === 1
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-sidebar-accent hover:bg-sidebar-accent/70 text-sidebar-foreground'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm text-sidebar-foreground/60 mb-2 block">Accent Color</label>
                  <div className="flex gap-3">
                    {['oklch(0.55 0.08 145)', 'oklch(0.6 0.18 25)', 'oklch(0.65 0.15 340)', 'oklch(0.5 0.12 220)'].map((color, idx) => (
                      <button
                        key={idx}
                        className="w-10 h-10 rounded-full border-2 border-transparent hover:border-sidebar-foreground/20 transition-all"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'advanced':
        return (
          <div className="space-y-6">
            <div className="glass-panel rounded-2xl p-6">
              <h3 className="text-xl font-semibold text-sidebar-foreground mb-4">Data & Storage</h3>
              <div className="space-y-4">
                <div className="p-4 bg-sidebar-accent/20 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-sidebar-foreground">Storage Used</h4>
                    <span className="text-sm text-sidebar-foreground/60">2.4 GB / 5 GB</span>
                  </div>
                  <div className="w-full bg-sidebar-accent rounded-full h-2">
                    <div className="h-2 rounded-full" style={{ width: '48%', backgroundColor: 'oklch(0.55 0.08 145)' }} />
                  </div>
                </div>

                <div className="space-y-2">
                  <button className="w-full flex items-center justify-between p-3 hover:bg-sidebar-accent/20 rounded-lg transition-colors">
                    <div className="flex items-center gap-3">
                      <Download className="w-4 h-4 text-sidebar-foreground/60" />
                      <span className="text-sidebar-foreground">Export All Data</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-sidebar-foreground/40" />
                  </button>

                  <button className="w-full flex items-center justify-between p-3 hover:bg-sidebar-accent/20 rounded-lg transition-colors">
                    <div className="flex items-center gap-3">
                      <RotateCcw className="w-4 h-4 text-sidebar-foreground/60" />
                      <span className="text-sidebar-foreground">Reset Settings</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-sidebar-foreground/40" />
                  </button>

                  <button className="w-full flex items-center justify-between p-3 hover:bg-red-500/10 rounded-lg transition-colors group">
                    <div className="flex items-center gap-3">
                      <Trash2 className="w-4 h-4 text-red-500" />
                      <span className="text-red-500">Delete Account</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-red-400 group-hover:text-red-500" />
                  </button>
                </div>
              </div>
            </div>

            <div className="glass-panel rounded-2xl p-6">
              <h3 className="text-xl font-semibold text-sidebar-foreground mb-4">About</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-sidebar-foreground/60">Version</span>
                  <span className="text-sidebar-foreground">2.1.0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sidebar-foreground/60">Last Updated</span>
                  <span className="text-sidebar-foreground">Dec 18, 2024</span>
                </div>
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
          <h1 className="zen-title text-4xl mb-2">Settings</h1>
          <p className="text-sidebar-foreground/70">Customize your zenWhisper experience</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:w-64">
            <div className="glass-panel rounded-2xl p-4 sticky top-8">
              <nav className="space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      activeTab === tab.id
                        ? 'bg-primary text-primary-foreground shadow-lg'
                        : 'text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/20'
                    }`}
                  >
                    {tab.icon}
                    <span className="font-medium">{tab.label}</span>
                  </button>
                ))}
              </nav>

              <div className="mt-8 pt-8 border-t border-sidebar-border">
                <button className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-500/10 rounded-xl transition-all">
                  <LogOut className="w-4 h-4" />
                  <span className="font-medium">Sign Out</span>
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 max-w-4xl">
            {renderTabContent()}

            {/* Save Button */}
            <div className="flex justify-end mt-8">
              <button
                className="px-6 py-3 zen-action-btn text-primary-foreground rounded-xl font-medium transition-all flex items-center gap-2"
                style={{
                  background: 'oklch(0.55 0.08 145)',
                  boxShadow: '0 4px 20px oklch(0.55 0.08 145 / 0.3)'
                }}
              >
                <Save className="w-4 h-4" />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;