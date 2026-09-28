import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { PageMeta } from './components/PageMeta'
import { PlaygroundSection } from './components/Playground/Section'
import { Section } from './components/Section'
import { Sidebar } from './components/Sidebar'
import { StructuredData } from './components/StructuredData'
import { modules } from './content'
import { useActiveSection } from './hooks/useActiveSection'

const SECTION_IDS = [...modules.map((module) => module.id), 'playground']

export const App = () => {
  const active = useActiveSection(SECTION_IDS, 'pipe')

  return (
    <>
      <StructuredData modules={modules} activeModule={active} />
      <PageMeta activeSection={active} />
      <Header />

      <main>
        <Hero />

        <div className="layout">
          <Sidebar modules={modules} active={active} />

          <div className="content">
            {modules.map((module, index) => (
              <Section key={module.id} module={module} index={index} />
            ))}

            <PlaygroundSection />
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
