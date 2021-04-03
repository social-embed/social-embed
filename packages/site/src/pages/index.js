import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import CodeBlock from '@theme/CodeBlock';

import styles from './styles.module.css';

const features = [
  {
    title: 'Easy to Use (Web component)',
    imageUrl: 'img/undraw_docusaurus_mountain.svg',
    description: (
      <>
        <Link to={'docs/wc/index'}>
          <code>{'<o-embed />'}</code> Web component
        </Link>
        :
        <CodeBlock className="language-html">{`<o-embed\n  url="https://youtu.be/FTQbiNvZqaY"\n  width="100%"\n></o-embed>`}</CodeBlock>
        <o-embed url="https://youtu.be/FTQbiNvZqaY" width="100%"></o-embed>
        <br />
        Try it live:{' '}
        <Link href="https://codepen.io/attachment/pen/poRRwdy">codepen.io</Link>
        , <Link href="https://jsfiddle.net/gitpull/vc13Lhkz/">jsfiddle</Link>
      </>
    ),
  },
  {
    title: 'Parse embeddable URLs (library only)',
    imageUrl: 'img/undraw_docusaurus_react.svg',
    description: (
      <>
        <Link to={'docs/lib/index'}>
          <code>{'@social-embed/lib'}</code>
        </Link>{' '}
        is a typed library for scraping IDs and converting IDs into an
        embed-friendly format.
        <CodeBlock className="language-typescript">
          {`import {
  getYouTubeIdFromUrl,
  youTubeUrlRegex
} from '@social-embed/lib';

'https://www.youtu.be/watch?v=Bd8_vO5zrjo'.match(youTubeUrlRegex)
// ["https://www.youtu.be/watch?v=Bd8_vO5zrjo","Bd8_vO5zrjo"]

getYouTubeIdFromUrl('https://www.youtu.be/watch?v=Bd8_vO5zrjo')
// "Bd8_vO5zrjo"
const provider = getProviderFromUrl(
  'https://www.youtu.be/watch?v=Bd8_vO5zrjo'
)
// YouTube
const getId = ProviderIdFunctionMap[provider]
getId("https://www.youtu.be/watch?v=Bd8_vO5zrjo")
// "Bd8_vO5zrjo"
`}
        </CodeBlock>
        Try it now:{' '}
        <Link href="https://codepen.io/attachment/pen/VwPPrNq">codepen.io</Link>
        <Link href="https://codepen.io/attachment/pen/poRRpdp?editors=0010">
          (console)
        </Link>
        , <Link href="https://jsfiddle.net/gitpull/pcLagbsm/">jsfiddle</Link>{' '}
        also,{' '}
        <Link href="https://social-embed.git-pull.com/api/modules/lib.html">
          API Documentation
        </Link>
      </>
    ),
  },
];

function Feature({imageUrl, title, description}) {
  const imgUrl = useBaseUrl(imageUrl);
  return (
    <div className={clsx('col col--6', styles.feature)}>
      {imgUrl && (
        <div className="text--center">
          <img className={styles.featureImage} src={imgUrl} alt={title} />
        </div>
      )}
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

export default function Home() {
  const context = useDocusaurusContext();
  const {siteConfig = {}} = context;
  return (
    <Layout
      title={`${siteConfig.title}: Embeds made easy`}
      description="Utilities and web component for adding embeds"
    >
      <header className={clsx('hero hero--primary', styles.heroBanner)}>
        <div className="container">
          <div className="hero__title">{siteConfig.title}</div>
          <p className="hero__subtitle">{siteConfig.tagline}</p>
          <div className={styles.buttons}>
            <Link
              className={clsx(
                'button button--outline button--secondary button--lg',
                styles.heroButton
              )}
              to={useBaseUrl('docs/')}
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>
      <main>
        {features && features.length > 0 && (
          <section className={styles.features}>
            <div className="container">
              <div className="row">
                {features.map((props, idx) => (
                  <Feature key={idx} {...props} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </Layout>
  );
}