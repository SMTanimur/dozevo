import { constructMetadata } from '@/configs';
import SpaceScreen from './screen/space-screen';
import { getServerAuthToken } from '@/lib/server-auth';
import { serverSpaceService, serverWorkspaceService } from '@/services';
import { Metadata } from 'next';

interface SpacePageProps {
  params: Promise<{
    w_id: string;
    space_id: string;
  }>;
}

export const generateMetadata = async ({
  params,
}: SpacePageProps): Promise<Metadata> => {
  const { w_id, space_id } = await params;

  try {
    const authToken = await getServerAuthToken();

    // Fetch space and workspace data in parallel
    const [space, workspace] = await Promise.all([
      serverSpaceService.getSpaceById(w_id, space_id, authToken),
      serverWorkspaceService.getWorkspaceById(w_id, authToken),
    ]);

    const spaceTitle = space.name || 'Untitled Space';
    const workspaceTitle = workspace.name || 'Workspace';
    const fullTitle = `${spaceTitle} - ${workspaceTitle}`;

    return constructMetadata({
      title: fullTitle,
      description: space.description
        ? `${space.description} - Manage tasks, collaborate with team members, and track progress in ${spaceTitle}.`
        : `Manage tasks, collaborate with team members, and track progress in ${spaceTitle}. Part of ${workspaceTitle} workspace.`,
      keywords: [
        'task management',
        'project management',
        'team collaboration',
        'workspace',
        'productivity',
        spaceTitle,
        workspaceTitle,
      ],
      ogImage: `https://taskgen.io/api/v1/workspaces/${w_id}/spaces/${space_id}/og-image`,
      canonical: `https://taskgen.io/w/${w_id}/s/${space_id}`,
    });
  } catch (error) {
    console.error('Failed to generate metadata for space:', error);

    // Fallback metadata if space fetching fails
    return constructMetadata({
      title: 'Space - TaskZen',
      description:
        'Manage your tasks and collaborate with your team in this space.',
      canonical: `https://taskgen.io/w/${w_id}/s/${space_id}`,
    });
  }
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const SpacePage = async ({ params }: SpacePageProps) => {
  



  return <SpaceScreen />;
};

export default SpacePage;
