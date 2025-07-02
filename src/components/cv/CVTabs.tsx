
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { CVGrid } from "./CVGrid";

interface CV {
  id: string;
  title: string;
  language: string;
  user_id: string;
  is_shared: boolean;
  share_token: string;
  created_at: string;
  updated_at: string;
  last_activity_at: string | null;
  last_activity_by: string | null;
  created_by: string | null;
  user?: {
    name: string;
    avatar?: string;
  };
  isOwn: boolean;
}

interface CVTabsProps {
  ownCVs: CV[];
  allCVs: CV[];
  isAdminOrOwner: boolean;
  showAllAsAdmin: boolean;
}

export function CVTabs({ ownCVs, allCVs, isAdminOrOwner, showAllAsAdmin }: CVTabsProps) {
  return (
    <Tabs defaultValue="yours" className="space-y-6">
      <TabsList className="grid w-full grid-cols-2 max-w-md">
        <TabsTrigger value="yours">
          {isAdminOrOwner && showAllAsAdmin ? "Your CVs" : "Yours"}
        </TabsTrigger>
        <TabsTrigger value="all">
          {isAdminOrOwner && showAllAsAdmin ? "All Organization CVs" : "All"}
        </TabsTrigger>
      </TabsList>

      <TabsContent value="yours" className="space-y-4">
        <CVGrid cvs={ownCVs} isAdminOrOwner={isAdminOrOwner} showCreateButton />
      </TabsContent>

      <TabsContent value="all" className="space-y-4">
        {allCVs.length > 0 ? (
          <div className="space-y-4">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              {isAdminOrOwner && showAllAsAdmin 
                ? `${allCVs.length} organization CVs`
                : `${allCVs.length} CVs`
              }
            </div>
            <CVGrid cvs={allCVs} isAdminOrOwner={isAdminOrOwner} />
            <div className="flex justify-center space-x-2 pt-6">
              <Button variant="outline" size="sm">1</Button>
              <Button variant="outline" size="sm">2</Button>
              <Button variant="outline" size="sm">3</Button>
              <Button variant="outline" size="sm">Next</Button>
            </div>
          </div>
        ) : (
          <CVGrid cvs={allCVs} isAdminOrOwner={isAdminOrOwner} />
        )}
      </TabsContent>
    </Tabs>
  );
}
