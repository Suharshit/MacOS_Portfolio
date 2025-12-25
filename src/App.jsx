import { NavBar, Welcome, Dock } from '#components'
import {
  Finder,
  Contact,
  Terminal,
  Safari,
  Photos,
  Resume,
  TxtFile,
  ImgFile,
  ProjectDetail
} from '#windows'

const App = () => {
  return (
    <main>
      {/* Top Navigation Bar */}
      <NavBar />

      {/* Welcome Hero Section */}
      <Welcome />

      {/* All Windows */}
      <Finder />
      <Contact />
      <Terminal />
      <Safari />
      <Photos />
      <Resume />
      <TxtFile />
      <ImgFile />
      <ProjectDetail />

      {/* Bottom Dock */}
      <Dock />
    </main>
  )
}

export default App