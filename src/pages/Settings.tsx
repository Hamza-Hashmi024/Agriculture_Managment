// Settings.tsx
import React, { FC } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const Settings: FC = () => {
  const navigate = useNavigate();

  const settingsOptions = [
    {
      title: "User Management",
      description: "Manage users, assign roles, and set permissions.",
      onClick: () => navigate("/users"),
    },
    {
      title: "Profile Settings",
      description: "Update your personal profile and account details.",
      onClick: () => navigate("/profile"),
    },
    {
      title: "App Preferences",
      description: "Customize application preferences and themes.",
      onClick: () => navigate("/preferences"),
    },
    {
      title: "Salary Tax Rules",
      description: "Add, edit or delete salary tax configurations.",
      onClick: () => navigate("/tax"),
    },
  ];

  return (
    <div className="p-8 space-y-8">
      {/* Page Heading */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account, preferences, and system-wide settings.
        </p>
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {settingsOptions.map((item, index) => (
          <Card
            key={index}
            className="hover:shadow-lg transition-shadow duration-200"
          >
            <CardHeader>
              <CardTitle className="text-lg">{item.title}</CardTitle>
              <CardDescription>{item.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={item.onClick} className="w-full">
                Go
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Settings;