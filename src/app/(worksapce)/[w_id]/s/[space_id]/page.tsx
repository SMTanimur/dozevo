import { constructMetadata } from '@/configs';
import SpaceScreen from './screen/space-screen';

interface SpacePageProps {
  params: {
    w_id: string;
    space_id: string;
  };
}

export const generateMetadata = async ({ params }: SpacePageProps) => {
  const { w_id, space_id } = await params;

  return constructMetadata({
    title: `Space ${space_id}`,
    description: `Space ${space_id}`,
    ogImage: `https://taskgen.io/api/v1/spaces/${space_id}/image`,
    canonical: `https://taskgen.io/w/${w_id}/s/${space_id}`,
  });
};

const SpacePage = async ({ params }: SpacePageProps) => {
  const { w_id, space_id } = await params;

  console.log(w_id, space_id);

  return <SpaceScreen />;
};

export default SpacePage;
