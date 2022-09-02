// import { Welcome } from '../components/Welcome/Welcome';
// import { ColorSchemeToggle } from '../components/ColorSchemeToggle/ColorSchemeToggle';

// export default function HomePage() {
//   return (
//     <>
//       <Welcome />
//       <ColorSchemeToggle />
//     </>
//   );
// }

import Layout from '../components/Layout';
import HeroSection from '../components/Hero';
import FeatureSection from '../components/Feature';

const Home: React.FC = () => (
  <Layout>
    <HeroSection />
    <FeatureSection />
  </Layout>
);

export default Home;
