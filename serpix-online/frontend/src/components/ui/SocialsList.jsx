import React from 'react';

export function SocialsList() {
  return (
    <ul className="social-links-list">
      <li className="icon-content">
        <a
          href="https://github.com/PedroVillasBoas"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub"
          data-social="github"
        >
          <div className="filled"></div>
          <img src="/assets/visual/img/github_icon.svg" alt="GitHub" />
        </a>
        <div className="tooltip">Pedro's GitHub</div>
      </li>
      <li className="icon-content">
        <a
          href="https://pedrovilasboas.itch.io/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Itch.io"
          data-social="itchio"
        >
          <div className="filled"></div>
          <img src="/assets/visual/img/itch_icon.svg" alt="Itch.io" />
        </a>
        <div className="tooltip">Pedro's Itch.io</div>
      </li>
      <li className="icon-content">
        <a
          href="https://www.linkedin.com/in/pedro-vilas-b%C3%B4as/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn"
          data-social="linkedin"
        >
          <div className="filled"></div>
          <img src="/assets/visual/img/linkedin_icon.svg" alt="LinkedIn" />
        </a>
        <div className="tooltip">Pedro's LinkedIn</div>
      </li>
      <li className="icon-content">
        <a
          href="https://pedrovilasboas.dev/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Portfolio"
          data-social="portfolio"
        >
          <div className="filled"></div>
          <img src="/assets/visual/img/portfolio_icon.svg" alt="Portfolio" />
        </a>
        <div className="tooltip">Pedro's Portfolio</div>
      </li>
    </ul>
  );
}