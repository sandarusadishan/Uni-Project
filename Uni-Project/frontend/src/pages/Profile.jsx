import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { User, Mail, Award, Package, Edit, Save, X, Upload, Loader2, Key } from 'lucide-react';
import Navbar from '../components/Navbar';
import { useAuth } from '../contexts/AuthContext';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { useToast } from '../hooks/use-toast';
import { Label } from '../components/ui/label';

const BASE_URL = "http://localhost:3000";
const API_URL = `${BASE_URL}/api`;

const Profile = () => {
  const { user, setUser } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  // ✅ New state for order count
  const [userTotalOrders, setUserTotalOrders] = useState('—'); 

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });

  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    if (user) {
      setFormData({ name: user.name, email: user.email });
    }
  }, [user]);
  
  // -----------------------------------------------------------
  // ✅ Order Count Fetch Logic
  useEffect(() => {
    const fetchOrderCount = async () => {
        if (!user || !user._id || !user.token) return;
        
        try {
            // /api/orders/user/:id API call එක භාවිත කරයි
            const res = await fetch(`${API_URL}/orders/user/${user._id}`, {
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                },
            });
            const data = await res.json();
            
            if (res.ok && Array.isArray(data)) {
                // Orders array එකේ දිග (length) Total Orders ගණන ලෙස සකසයි.
                setUserTotalOrders(data.length);
            } else {
                console.error("Failed to fetch user orders:", data.message);
                setUserTotalOrders(0);
            }
        } catch (error) {
            console.error('Error fetching order count:', error);
            setUserTotalOrders(0);
        }
    };

    if (user && user.token) {
        fetchOrderCount();
    }
  }, [user]);
  // -----------------------------------------------------------

  useEffect(() => {
    if (selectedFile) {
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewUrl(null);
    }
  }, [selectedFile]);

  // --- Profile Update Logic ---
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!user || loading) return;

    setLoading(true);
    const updateFormData = new FormData();

    updateFormData.append('name', formData.name);
    updateFormData.append('email', formData.email);
    if (user.role) updateFormData.append('role', user.role);

    if (selectedFile) {
      updateFormData.append('profilePic', selectedFile);
    }

    try {
      const res = await fetch(`${API_URL}/users/${user._id}`, {
        method: 'PUT',
        body: updateFormData,
        // headers: { 'Authorization': `Bearer ${user.token}` }, // Add token if required
      });

      const data = await res.json();

      if (res.ok) {
        toast({
          title: '✅ Profile Updated!',
          description: 'Your information has been successfully saved.',
        });

        if (setUser) {
          const updatedUser = data.user;
          setUser((prev) => ({
            ...prev,
            ...updatedUser,
            profileImage: updatedUser.profileImage || prev.profileImage,
          }));
        }

        setIsEditing(false);
        setSelectedFile(null);
      } else {
        throw new Error(data.message || 'Failed to update profile.');
      }
    } catch (error) {
      console.error('Profile update error:', error);
      toast({
        title: '❌ Update Failed',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // --- Password Change Logic ---
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (!user || loading) return;

    if (passwordData.newPassword.length < 6) {
      return toast({
        title: 'Password too short',
        description: 'New password must be at least 6 characters.',
        variant: 'destructive',
      });
    }
    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      return toast({
        title: 'Mismatch',
        description: 'New passwords do not match.',
        variant: 'destructive',
      });
    }

    setLoading(true);

    try {
      // Password change API call (requires current password verification)
      const res = await fetch(`${API_URL}/users/change-password/${user._id}`, {
        method: 'PUT',
        headers: { 
            'Content-Type': 'application/json',
            // 'Authorization': `Bearer ${user.token}` // Add token if required
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast({
          title: '✅ Success',
          description: 'Password changed successfully. You may need to log in again soon.',
        });
        setPasswordData({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
        setIsChangingPassword(false);
      } else {
        throw new Error(data.message || 'Failed to change password.');
      }
    } catch (error) {
      console.error('Password change error:', error);
      toast({
        title: '❌ Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // --- UI Handlers ---
  const handleCancelEdit = () => {
    setIsEditing(false);
    setFormData({ name: user.name, email: user.email });
    setSelectedFile(null);
  };

  const handleCancelPasswordChange = () => {
    setIsChangingPassword(false);
    setPasswordData({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
  };

  if (!user) return <div className="text-center py-20">Please log in to view your profile.</div>;

  // 🖼️ Profile Image Display Logic (Cache Busting Added)
  const timestamp = new Date().getTime(); 
  
  const displayImage =
    previewUrl
      ? previewUrl
      : user.profileImage 
      ? `${BASE_URL}${user.profileImage}?t=${timestamp}`
      : 'placeholder';

  const ProfileImageUI = () => (
    <div className="flex items-center justify-center w-20 h-20 rounded-full bg-primary/20 overflow-hidden">
      {displayImage === 'placeholder' ? (
        <User className="w-10 h-10 text-primary" />
      ) : (
        <img src={displayImage} alt="Profile" className="object-cover w-full h-full rounded-full" />
      )}
    </div>
  );

  // 🎯 Stats Array: Dynamic Total Orders value
  const stats = [
    { label: 'Loyalty Points', value: user.loyaltyPoints || 0, icon: Award, color: 'text-primary' },
    { label: 'Total Orders', value: userTotalOrders, icon: Package, color: 'text-blue-500' }, // ✅ Dynamic Value
    { 
        label: 'Member Since', 
        value: user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'N/A', 
        icon: User, 
        color: 'text-green-500' 
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary">
      <Navbar />

      <div className="container px-4 py-8 mx-auto">
        <h1 className="mb-8 text-4xl font-bold">My Profile</h1>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Profile Info Card */}
          <div className="space-y-6 lg:col-span-2">
            <Card className="p-8 glass">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <ProfileImageUI />
                  <div>
                    {isEditing ? (
                      <div className="space-y-2">
                        {/* Name Input */}
                        <Input
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Your Name"
                          className="text-xl font-bold"
                        />
                        {/* Email Input */}
                        <Input
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="Your Email"
                          className="text-muted-foreground"
                        />
                      </div>
                    ) : (
                      <>
                        <h2 className="mb-1 text-2xl font-bold">{user.name}</h2>
                        <p className="flex items-center gap-2 text-muted-foreground">
                          <Mail className="w-4 h-4" />
                          {user.email}
                        </p>
                      </>
                    )}
                  </div>
                </div>
                <Badge variant="secondary" className="text-lg">
                  {user.role}
                </Badge>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {stats.map((stat) => (
                  <div key={stat.label} className="p-4 text-center rounded-lg bg-secondary">
                    <stat.icon className={`h-8 w-8 mx-auto mb-2 ${stat.color}`} />
                    <p className="mb-1 text-2xl font-bold">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                ))}
              </div>
            </Card>

            {/* Account Settings */}
            <Card className="p-8 glass">
              <h3 className="mb-4 text-xl font-bold">Account Settings</h3>

              {/* Edit Profile */}
              {isEditing && (
                <form onSubmit={handleUpdateProfile} className="space-y-4 mb-6 p-4 rounded-lg border border-primary/20">
                  <h4 className="font-semibold">Update Details & Photo</h4>
                  <div className="space-y-2">
                    <Label htmlFor="profile-pic">Change Profile Picture</Label>
                    <div className="flex items-center gap-4">
                      {/* File Input */}
                      <Input
                        id="profile-pic"
                        type="file"
                        accept="image/*"
                        onChange={(e) => setSelectedFile(e.target.files[0])}
                        className="flex-1"
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full gap-2" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" /> Save Changes
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handleCancelEdit}
                    className="w-full gap-2"
                  >
                    <X className="w-4 h-4" /> Cancel
                  </Button>
                </form>
              )}

              {/* Change Password */}
              {isChangingPassword && (
                <form
                  onSubmit={handlePasswordChange}
                  className="space-y-4 mb-6 p-4 rounded-lg border border-red-500/20"
                >
                  <h4 className="font-semibold flex items-center gap-2 text-red-400">
                    <Key className="w-4 h-4" /> Change Password
                  </h4>
                  <Input
                    type="password"
                    placeholder="Current Password"
                    value={passwordData.currentPassword}
                    onChange={(e) =>
                      setPasswordData({ ...passwordData, currentPassword: e.target.value })
                    }
                    required
                  />
                  <Input
                    type="password"
                    placeholder="New Password (min 6 chars)"
                    value={passwordData.newPassword}
                    onChange={(e) =>
                      setPasswordData({ ...passwordData, newPassword: e.target.value })
                    }
                    required
                  />
                  <Input
                    type="password"
                    placeholder="Confirm New Password"
                    value={passwordData.confirmNewPassword}
                    onChange={(e) =>
                      setPasswordData({ ...passwordData, confirmNewPassword: e.target.value })
                    }
                    required
                  />

                  <Button
                    type="submit"
                    className="w-full gap-2 bg-red-600 hover:bg-red-700"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" /> Updating...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" /> Update Password
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handleCancelPasswordChange}
                    className="w-full gap-2"
                  >
                    <X className="w-4 h-4" /> Cancel
                  </Button>
                </form>
              )}

              {!isEditing && !isChangingPassword && (
                <div className="space-y-4">
                  <Button
                    variant="outline"
                    className="justify-start w-full gap-2"
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit className="w-4 h-4" /> Edit Profile
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start w-full gap-2"
                    onClick={() => setIsChangingPassword(true)}
                  >
                    <Key className="w-4 h-4" /> Change Password
                  </Button>
                  <Button variant="outline" className="justify-start w-full">
                    Notification Preferences
                  </Button>
                </div>
              )}
            </Card>
          </div>

          {/* Recent Activity */}
          <div className="lg:col-span-1">
            <Card className="sticky p-6 glass top-24">
              <h3 className="mb-4 text-xl font-bold">Recent Activity</h3>
              <div className="space-y-3 text-sm">
                <div className="p-3 rounded-lg bg-secondary">
                  <p className="mb-1 font-semibold">Order Completed</p>
                  <p className="text-muted-foreground">2 hours ago</p>
                </div>
                <div className="p-3 rounded-lg bg-secondary">
                  <p className="mb-1 font-semibold">Challenge Completed</p>
                  <p className="text-muted-foreground">1 day ago</p>
                </div>
                <div className="p-3 rounded-lg bg-secondary">
                  <p className="mb-1 font-semibold">Badge Unlocked</p>
                  <p className="text-muted-foreground">3 days ago</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;