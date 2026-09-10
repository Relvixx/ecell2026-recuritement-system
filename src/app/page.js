import { Button } from '@/components/ui/forms';
import { Container, EditorialCard, Eyebrow, PageShell, Section, Stack } from '@/components/ui/layout';
import { AnnotationLabel, EditorialPhotoFrame, EditorialUnderline, IrregularPaperBlock, TapeAccent } from '@/components/shells/editorial';
import { ParticipantFooter, ParticipantHeader } from '@/components/shells/participant';
import { FAQAccordion, LandingStickyApplyController, TeamExplorer } from '@/components/landing/LandingInteractions';
import { RECRUITMENT_WINDOW_LABEL } from '@/config/recruitment';

const lifeMoments = [
  {
    key: 'lifePrep',
    label: '01 / PREP',
    caption: 'the calm before the event',
    className: 'life-orbit-card life-orbit-card--prep',
    mediaClassName: 'life-orbit-media aspect-[1.22/1]'
  },
  {
    key: 'lifeTeam',
    label: '02 / TOGETHER',
    caption: 'figuring it out together',
    className: 'life-orbit-card life-orbit-card--team',
    mediaClassName: 'life-orbit-media aspect-[3/4]'
  },
  {
    key: 'lifeEvent',
    label: '03 / EXECUTE',
    caption: 'this is what execution looks like',
    className: 'life-orbit-card life-orbit-card--event',
    mediaClassName: 'life-orbit-media aspect-[1.4/1]'
  },
  {
    key: 'lifeBts',
    label: '04 / BTS',
    caption: 'behind the scenes',
    className: 'life-orbit-card life-orbit-card--bts',
    mediaClassName: 'life-orbit-media aspect-[1/1]'
  },
  {
    key: 'lifeCelebration',
    label: '05 / AFTER',
    caption: 'a win shared by the room',
    className: 'life-orbit-card life-orbit-card--celebration',
    mediaClassName: 'life-orbit-media aspect-[4/3]'
  },
  {
    key: 'lifeVideoPoster',
    label: '06 / MAKE',
    caption: 'when ideas become work',
    className: 'life-orbit-card life-orbit-card--video',
    mediaClassName: 'life-orbit-media aspect-[16/10]'
  }
];

const benefits = [
  {
    title: 'Build things that matter',
    body: 'Work on projects, events and systems that other people will actually experience.',
    accent: 'var(--color-powder-blue)',
    className: 'lg:col-span-5'
  },
  {
    title: 'Own real responsibility',
    body: "Your contribution won't stay inside an assignment folder. People will depend on it.",
    accent: 'var(--color-peach)',
    className: 'lg:col-span-4 lg:translate-y-10'
  },
  {
    title: 'Learn outside your branch',
    body: "Work with people who think differently from you and pick up skills classrooms don't always teach.",
    accent: 'var(--color-sage)',
    className: 'lg:col-span-3'
  },
  {
    title: 'Meet people who execute',
    body: 'Surround yourself with students who like turning ideas into action.',
    accent: 'var(--color-blush)',
    className: 'lg:col-span-6 lg:-translate-y-4'
  },
  {
    title: 'Get comfortable figuring things out',
    body: "You won't always know the answer before you start. That's part of the point.",
    accent: 'var(--color-butter)',
    className: 'lg:col-span-6 lg:translate-y-8'
  }
];

const journeyStages = [
  {
    number: '01',
    title: 'APPLY',
    body: "Tell us about yourself, what you'd like to work on and why."
  },
  {
    number: '02',
    title: 'WE REVIEW',
    body: 'The team goes through your application and understands where you may fit best.'
  },
  {
    number: '03',
    title: 'INTERACTION',
    body: 'Shortlisted applicants move to a conversation or interview with the team.'
  },
  {
    number: '04',
    title: 'FINAL CALL',
    body: 'After interaction, final selections are made.'
  },
  {
    number: '05',
    title: 'WELCOME IN',
    body: 'If selected, your E-CELL journey starts here.'
  }
];

const faqItems = [
  {
    question: 'Do I need previous experience?',
    answer: "No. Previous experience can help, but it isn't the only thing we're looking for. Curiosity, effort, thinking and willingness to learn matter too."
  },
  {
    question: 'Can first-year students apply?',
    answer: 'Yes. Recruitment is open to 1st, 2nd and 3rd-year students.'
  },
  {
    question: 'Can I choose two teams?',
    answer: "Yes. You'll choose one primary team and can optionally select a second preference."
  },
  {
    question: "What if I'm unsure which team to choose?",
    answer: "Explore the team descriptions first and choose the kind of work you'd genuinely enjoy trying. You don't need to have everything figured out already."
  },
  {
    question: 'What happens after I submit?',
    answer: "We'll review your application. If you're shortlisted, you'll receive details about the next interaction or interview stage."
  },
  {
    question: 'How much time will E-CELL require?',
    answer: "It depends on the team and what's happening that week. During events, things can get busier. In the application, we'll ask how much time you can realistically contribute."
  },
  {
    question: 'Can I edit my application after submitting?',
    answer: 'Please review your application carefully before submitting. If something important needs correcting later, contact the recruitment team.'
  },
  {
    question: 'How will I know my application status?',
    answer: "After submitting, you'll receive an Application ID that you can use with your registered email to track your current recruitment status."
  }
];

export default function Home() {
  return (
    <PageShell className="landing-desktop landing-midnight overflow-x-hidden pb-24 md:pb-0" recruitmentTheme="midnight">
      <ParticipantHeader />

      <Section className="landing-hero" spacing="hero" data-hero-section>
        <Container className="grid items-center gap-12 lg:min-h-[86svh] lg:grid-cols-[1.04fr_0.96fr] lg:gap-14 xl:gap-20">
          <Stack gap="lg" className="motion-settle">
            <div className="flex flex-wrap items-center gap-3">
              <Eyebrow>Recruitment 2026&ndash;27</Eyebrow>
              <span className="landing-status-pill body-small inline-flex min-h-11 items-center gap-2 rounded-full bg-[var(--color-sage)] px-4 text-foreground">
                <span aria-hidden="true">&#9679;</span>
                {RECRUITMENT_WINDOW_LABEL}
              </span>
              <span className="landing-audience-pill body-small inline-flex min-h-11 items-center rounded-full border border-border bg-surface px-4 text-muted">
                For 1st, 2nd &amp; 3rd year students
              </span>
            </div>

            <h1 className="display-hero max-w-[760px]">
              Don&apos;t just
              <br />
              join a club.
              <br />
              <EditorialUnderline>Build one.</EditorialUnderline>
            </h1>

            <p className="body-large max-w-[650px] text-muted lg:text-[1.28rem] lg:leading-[1.72]">
              Join the people behind the ideas, events, stories, systems and execution that make E-CELL happen.
            </p>

            <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center lg:gap-4" data-hero-cta>
              <Button className="lg:px-7" href="/apply">
                Start your application <span className="arrow-shift" aria-hidden="true">&#8599;</span>
              </Button>
              <Button className="lg:px-6" href="#teams" variant="ghost">
                Explore the teams <span aria-hidden="true">&darr;</span>
              </Button>
            </div>
          </Stack>

          <div className="relative min-h-[430px] pt-4 sm:min-h-[500px] lg:min-h-[640px]">
            <TapeAccent className="absolute left-10 top-2 z-10 lg:left-20" />
            <EditorialPhotoFrame
              className="motion-fade-up absolute left-0 top-8 w-[88%] lg:left-2 lg:top-6 lg:w-[84%]"
              mediaClassName="aspect-[4/3] lg:aspect-[4/3.35]"
              mediaKey="heroMain"
            />
            <div className="absolute bottom-0 right-0 w-[58%] max-w-[260px] lg:bottom-7 lg:w-[44%] lg:max-w-none">
              <AnnotationLabel className="absolute -top-5 right-2 z-10">apply here &rarr;</AnnotationLabel>
              <EditorialPhotoFrame className="motion-fade-up" mediaClassName="aspect-[1/1]" mediaKey="heroSecondary" rotate="left" />
            </div>
          </div>
        </Container>
      </Section>

      <Section id="about" spacing="major" className="landing-about bg-[var(--surface)]">
        <Container className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-center lg:gap-16">
          <Stack gap="lg">
            <Stack gap="sm">
              <Eyebrow>ABOUT US</Eyebrow>
              <h2 className="display-section">What even is E-CELL?</h2>
            </Stack>
            <IrregularPaperBlock className="landing-manifesto bg-[var(--paper)]/88 lg:p-8">
              <p className="heading lg:max-w-[560px]">Ideas are easy. Execution is the interesting part.</p>
              <p className="body-large mt-5 max-w-[620px] text-muted lg:text-[1.16rem]">
                E-CELL MET is a student-led community where ideas turn into events, projects, collaborations and real responsibility. Different teams bring different strengths&mdash;but everything comes together through execution.
              </p>
            </IrregularPaperBlock>
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-muted lg:text-[0.82rem]">
              {['BUILD', 'CREATE', 'CONNECT', 'EXECUTE'].map((word) => (
                <span className="border-b border-foreground/20 py-1" key={word}>
                  {word}
                </span>
              ))}
            </div>
          </Stack>
          <div className="relative">
            <TapeAccent className="absolute -top-3 right-10 z-10 rotate-3" />
            <EditorialPhotoFrame mediaKey="aboutTeam" rotate="right" />
          </div>
        </Container>
      </Section>

      <Section id="life" spacing="compact" className="landing-life bg-[var(--canvas)]">
        <Container>
          <div className="life-orbit-stage">
            <div className="life-story-core">
              <span aria-hidden="true" className="life-story-core-mark" />
              <Eyebrow>BEHIND THE SCENES</Eyebrow>
              <h2 className="display-section">Life at E-CELL</h2>
              <p className="body-large text-muted lg:text-[1.1rem]">
                Somewhere between planning, deadlines, ideas and a little chaos&mdash;things get built.
              </p>
              <div className="life-story-core-footer" aria-label="E-CELL moments">
                <span>PLAN</span>
                <span>MAKE</span>
                <span>SHOW UP</span>
              </div>
            </div>

            <div className="life-orbit-media-group">
              {lifeMoments.map((moment) => (
                <EditorialPhotoFrame
                  caption={moment.caption}
                  captionMeta={moment.label}
                  className={moment.className}
                  key={moment.key}
                  mediaClassName={moment.mediaClassName}
                  mediaKey={moment.key}
                />
              ))}
            </div>
          </div>
        </Container>
      </Section>

      <Section id="teams" spacing="major" className="landing-teams">
        <Container>
          <Stack gap="lg">
            <div className="grid gap-5 lg:grid-cols-[0.72fr_1.28fr] lg:items-end lg:gap-10">
              <Stack gap="sm">
                <Eyebrow>THE TEAMS</Eyebrow>
                <h2 className="display-section">Find your squad</h2>
              </Stack>
              <p className="body-large max-w-[720px] text-muted lg:justify-self-end lg:text-[1.18rem]">
                Seven teams. Different strengths. Same mission. Pick the kind of work you&apos;d actually enjoy doing.
              </p>
            </div>
            <TeamExplorer />
          </Stack>
        </Container>
      </Section>

      <Section spacing="major" className="landing-benefits bg-[var(--footer-bg)]">
        <Container>
          <Stack gap="lg">
            <div className="max-w-[760px]">
              <Eyebrow>WHY E-CELL?</Eyebrow>
              <h2 className="display-section mt-3">What you&apos;ll actually get</h2>
              <p className="body-large mt-5 text-muted lg:text-[1.16rem]">
                The point isn&apos;t just being part of another club. It&apos;s getting the chance to do work that asks something from you.
              </p>
            </div>

            <div className="grid gap-4 lg:grid-cols-12 lg:items-start lg:gap-5">
              {benefits.map((benefit, index) => (
                <EditorialCard
                  accent={benefit.accent}
                  className={`landing-benefit-card ${benefit.className} ${index % 2 === 1 ? 'max-lg:ml-6' : ''}`}
                  key={benefit.title}
                >
                  <p className="body-small text-muted">{String(index + 1).padStart(2, '0')}</p>
                  <h3 className="heading mt-4">{benefit.title}</h3>
                  <p className="body mt-4 text-muted lg:text-[1.04rem] lg:leading-[1.72]">{benefit.body}</p>
                </EditorialCard>
              ))}
            </div>
          </Stack>
        </Container>
      </Section>

      <Section id="journey" spacing="major" className="landing-journey bg-[var(--surface)]">
        <Container>
          <Stack gap="lg">
            <div className="max-w-[780px]">
              <Eyebrow>WHAT HAPPENS NEXT?</Eyebrow>
              <h2 className="display-section mt-3">Here&apos;s what happens after you apply</h2>
            </div>
            <ol className="relative grid gap-8 lg:grid-cols-5 lg:gap-x-8 lg:gap-y-12 lg:pb-20 lg:pt-2">
              <span aria-hidden="true" className="absolute left-5 top-6 hidden h-[calc(100%-3rem)] w-px bg-foreground/20 max-lg:block" />
              <span aria-hidden="true" className="absolute left-8 right-8 top-8 hidden h-px bg-foreground/20 lg:block" />
              {journeyStages.map((stage, index) => (
                <li className="relative pl-14 lg:pl-0 lg:pt-16" key={stage.number}>
                  <span className="absolute left-0 top-1 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-surface text-sm font-medium lg:top-0 lg:h-12 lg:w-12">
                    {stage.number}
                  </span>
                  <div className={index % 2 === 1 ? 'lg:translate-y-12' : ''}>
                    <h3 className="label lg:text-[1.08rem]">{stage.title}</h3>
                    <p className="body mt-3 text-muted lg:max-w-[250px] lg:text-[1.14rem] lg:leading-[1.72]">{stage.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </Stack>
        </Container>
      </Section>

      <Section id="faq" spacing="major" className="landing-faq">
        <Container className="landing-faq-container" width="default">
          <Stack gap="lg">
            <Stack gap="sm">
              <Eyebrow>FAQ</Eyebrow>
              <h2 className="display-section">A few things you might be wondering</h2>
            </Stack>
            <FAQAccordion items={faqItems} />
          </Stack>
        </Container>
      </Section>

      <Section spacing="compact" className="landing-final-cta bg-[var(--canvas)]">
        <Container>
          <div className="landing-final-panel relative overflow-hidden rounded-[var(--radius-paper)] border border-border bg-[var(--paper)] p-6 shadow-[var(--shadow-soft)] sm:p-10 lg:p-14" data-final-cta>
            <TapeAccent className="absolute right-10 top-6 rotate-2" />
            <Stack gap="lg" className="max-w-[760px]">
              <div>
                <h2 className="display-section">
                  Still scrolling?
                  <br />
                  <span className="text-muted">Might as well apply.</span>
                </h2>
                <p className="body-large mt-5 max-w-[620px] text-muted lg:text-[1.18rem]">
                  Find the team you&apos;d enjoy working with and tell us what you can bring to it.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center lg:gap-5">
                <Button className="lg:px-7" href="/apply">
                  Start your application <span className="arrow-shift" aria-hidden="true">&#8599;</span>
                </Button>
                <p className="body-small text-muted lg:text-[0.98rem]">For 1st, 2nd &amp; 3rd year students.</p>
              </div>
            </Stack>
          </div>
        </Container>
      </Section>

      <ParticipantFooter />
      <LandingStickyApplyController />
    </PageShell>
  );
}
