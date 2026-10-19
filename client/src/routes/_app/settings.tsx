import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/shared/page-header";
import { DataState } from "@/components/shared/data-state";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useProfile } from "@/features/users/hooks/use-profile";
import { ProfileSettings } from "@/features/users/components/profile-settings";
import { PreferencesSettings } from "@/features/users/components/preferences-settings";
import { DataSettings } from "@/features/users/components/data-settings";
import { DangerZone } from "@/features/users/components/danger-zone";
import { WeeklyGoalSettings } from "@/features/data-io/components/weekly-goal-settings";
import { PlatformsSettings } from "@/features/platforms/components/platforms-settings";

export const Route = createFileRoute("/_app/settings")({ component: SettingsPage });

function SettingsPage() {
  const { data: profile, isLoading, isError, error, refetch } = useProfile();

  return (
    <div className="space-y-5">
      <PageHeader title="Settings" description="Manage your profile, preferences, and data." />

      <DataState
        isLoading={isLoading}
        isError={isError}
        error={error}
        onRetry={refetch}
        loadingFallback={<Skeleton className="h-96 w-full rounded-xl" />}
      >
        {profile && (
          <Tabs defaultValue="profile" className="gap-5">
            <TabsList variant="line" className="flex-wrap">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
              <TabsTrigger value="goal">Weekly goal</TabsTrigger>
              <TabsTrigger value="platforms">Platforms</TabsTrigger>
              <TabsTrigger value="data">Data</TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <ProfileSettings profile={profile} />
            </TabsContent>
            <TabsContent value="preferences">
              <PreferencesSettings profile={profile} />
            </TabsContent>
            <TabsContent value="goal">
              <WeeklyGoalSettings />
            </TabsContent>
            <TabsContent value="platforms">
              <PlatformsSettings />
            </TabsContent>
            <TabsContent value="data" className="space-y-5">
              <DataSettings />
              <DangerZone />
            </TabsContent>
          </Tabs>
        )}
      </DataState>
    </div>
  );
}