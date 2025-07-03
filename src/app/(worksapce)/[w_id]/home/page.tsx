import { constructMetadata } from '@/configs';
import { siteCorConfig } from '@/configs/seo/site-config';
import { serverWorkspaceService } from '@/services/workspace/server';
import { WorkspaceHomeScreen } from './screen/workspace-home-screen';
import { getServerAuthToken } from '@/lib/server-auth';

type Params = {
  params: Promise<{
    w_id: string;
  }>;
};

export const generateMetadata = async ({ params }: Params) => {
  try {
    const { w_id } = await params;

    // Get auth token from server-side cookies
    const authToken = await getServerAuthToken();

    // Try to fetch workspace with auth token
    let workspace;
    try {
      workspace = await serverWorkspaceService.getWorkspaceById(
        w_id,
        authToken
      );
      console.log({ workspace });
    } catch {
      console.log(
        'Failed to fetch workspace with auth, using fallback metadata'
      );
      // If auth fails, return fallback metadata
      return constructMetadata({
        title: 'Workspace',
        description:
          'Notiqo Workspace - Manage your tasks and projects efficiently',
        canonical: `${siteCorConfig.url}/${w_id}/home`,
        ogImage: `${siteCorConfig.url}/images/seo_image.png`,
      });
    }

    return constructMetadata({
      title: workspace.name,
      description: `Workspace ${workspace.name} - Manage your tasks and projects efficiently`,
      canonical: `${siteCorConfig.url}/${w_id}/home`,
      ogImage: workspace.avatar || `${siteCorConfig.url}/images/seo_image.png`,
    });
  } catch (error) {
    // Fallback metadata if workspace fetch fails
    console.error('Failed to fetch workspace for metadata:', error);
    return constructMetadata({
      title: 'Workspace',
      description:
        'Notiqo Workspace - Manage your tasks and projects efficiently',
      canonical: `${siteCorConfig.url}/workspace`,
      ogImage: `${siteCorConfig.url}/images/seo_image.png`,
    });
  }
};

const WorkspaceHome = async ({ params }: Params) => {
  const { w_id } = await params;
  return <WorkspaceHomeScreen w_id={w_id} />;
};

export default WorkspaceHome;
