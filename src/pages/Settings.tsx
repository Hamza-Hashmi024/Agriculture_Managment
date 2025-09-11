// Settings.tsx
import React, { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardTitle } from '@/components/ui/card';

const Settings: FC = () => {
  const navigate = useNavigate();

  const handleUserManagementClick = () => {
    navigate('/users');
  };

  const handleProfileSettingsClick = () => {
    navigate('/profile');
  };

  const handleAppPreferencesClick = () => {
    navigate('/preferences');
  };

  const handleTax = () => {
    navigate('/tax');
  };

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="flex flex-col items-start gap-4">
            <CardTitle>User Management</CardTitle>
            <Button onClick={handleUserManagementClick}>Go</Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex flex-col items-start gap-4">
            <CardTitle>Profile Settings</CardTitle>
            <Button onClick={handleProfileSettingsClick}>Go</Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex flex-col items-start gap-4">
            <CardTitle>App Preferences</CardTitle>
            <Button onClick={handleAppPreferencesClick}>Go</Button>
          </CardContent>
        </Card>


           <Card>
          <CardContent className="flex flex-col items-start gap-4">
            <CardTitle>Add Salaries Tax</CardTitle>
            <Button onClick={handleTax}>Go</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;