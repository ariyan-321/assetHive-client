import React from 'react';

export default function Footer() {
  return (
    <div className='mt-[60vh] bg-blue-400'>
      <footer className="footer p-10 container mx-auto flex justify-between items-center">
        <aside>
          <img className='w-[100px]' src="/images/assetHive.png" alt="AssetHive Logo" />
          <p>
            AssetHive - Employee Asset Management Software
            <br />
            Managing assets with ease and precision.
          </p>
        </aside>
        <nav>
          <h6 className="footer-title">Services</h6>
          <a className="link link-hover">Asset Tracking</a>
          <a className="link link-hover">Inventory Management</a>
          <a className="link link-hover">Reporting</a>
          <a className="link link-hover">Support</a>
        </nav>
        <nav>
          <h6 className="footer-title">Company</h6>
          <a className="link link-hover">About us</a>
          <a className="link link-hover">Contact</a>
          <a className="link link-hover">Careers</a>
          <a className="link link-hover">Press Kit</a>
        </nav>
        <nav>
          <h6 className="footer-title">Legal</h6>
          <a className="link link-hover">Terms of Use</a>
          <a className="link link-hover">Privacy Policy</a>
          <a className="link link-hover">Cookie Policy</a>
        </nav>
      </footer>
    </div>
  );
}
