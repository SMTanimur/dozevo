import { constructMetadata } from '@/configs';
import { siteCorConfig } from '@/configs/seo/site-config';
import { WorkspaceService } from '@/services';
import { WorkspaceHomeScreen } from './screen/workspace-home-screen';

type Params = {
  params: Promise<{
    w_id: string;
  }>;
};

export const generateMetadata = async ({ params }: Params) => {
  const { w_id } = await params;
  const workspaceService = new WorkspaceService();
  const workspace = await workspaceService.getWorkspaceById(w_id);
  return constructMetadata({
    title: workspace.name,
    description: `Workspace ${workspace.name}`,
    canonical: `${siteCorConfig.url}/${w_id}/home`,
    ogImage: workspace.avatar || `${siteCorConfig.url}/images/seo_image.png`,
  });
};

const WorkspaceHome = async ({ params }: Params) => {
  const { w_id } = await params;
  return <WorkspaceHomeScreen w_id={w_id} />;
};

export default WorkspaceHome;
