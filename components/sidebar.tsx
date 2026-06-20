'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

// Minimal icon components to avoid external dependency
type IconProps = { size?: number }
const LayoutGrid = ({ size = 18 }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      x="3"
      y="3"
      width="8"
      height="8"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <rect
      x="13"
      y="3"
      width="8"
      height="8"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <rect
      x="3"
      y="13"
      width="8"
      height="8"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <rect
      x="13"
      y="13"
      width="8"
      height="8"
      stroke="currentColor"
      strokeWidth="1.5"
    />
  </svg>
)

const Settings = ({ size = 24 }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 15.5A3.5 3.5 0 1 0 12 8.5a3.5 3.5 0 0 0 0 7z"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <path
      d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06A2 2 0 1 1 2.28 16.9l.06-.06c.45-.45.58-1.1.33-1.82a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09c.7 0 1.27-.4 1.51-1a1.65 1.65 0 0 0-.33-1.82L4.3 4.3A2 2 0 1 1 7.12 1.47l.06.06c.45.45 1.1.58 1.82.33.6-.25 1.26-.25 1.86 0 .72.25 1.37.12 1.82-.33l.06-.06A2 2 0 1 1 19.7 4.3l-.06.06c-.45.45-.58 1.1-.33 1.82.25.6.25 1.26 0 1.86a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83l-.06.06z"
      stroke="currentColor"
      strokeWidth="1"
    />
  </svg>
)

const HelpCircle = ({ size = 24 }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
    <path
      d="M12 17h.01"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M9.5 10a2.5 2.5 0 1 1 5 0c0 1.75-2 2.25-2 3.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
)

export default function Sidebar() {
  const pathname = usePathname()

  const menuItems = [
    { label: 'DASHBOARD', path: '/dashboard' },
    { label: 'ACCOUNTS', path: '/bank-accounts' },
    { label: 'BANK TRANSFER', path: '/bank-transfer' },
    { label: 'PAY BILLS', path: '/pay-bills' },
    { label: 'SMART SPEND', path: '/smart-spend' },
    { label: 'E-STATEMENT', path: '/e-statement' }
  ]

  return (
    <aside className="sidebar">
      <div className="sidebar-top">
        {/* Logo Area */}
        <div className="logo-wrapper">
          <div className="logo-container">
            <span className="logo-letter">N</span>
          </div>
          <h1 className="brand-name">NOVA BANK</h1>
        </div>

        {/* Navigation Menu */}
        <nav className="menu">
          {menuItems.map((item) => {
            const isActive = pathname === item.path
            return (
              <Link key={item.label} href={item.path} className="menu-link">
                <button className={`menu-item ${isActive ? 'active' : ''}`}>
                  {isActive && <div className="active-indicator" />}
                  {item.label === 'DASHBOARD' && <LayoutGrid size={18} />}
                  <span className="menu-label">{item.label}</span>
                </button>
              </Link>
            )
          })}
        </nav>
      </div>

      <div className="sidebar-footer">
        <div className="footer-icon">
          <Settings size={22} />
        </div>
        <div className="footer-icon">
          <HelpCircle size={22} />
        </div>
      </div>

      <style jsx>{`
        .sidebar {
          width: 280px;
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border-right: 1px solid rgba(255, 255, 255, 0.05);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          flex-shrink: 0;
          position: relative;
          z-index: 20;
          transition: all 0.3s ease;
        }

        .sidebar-top {
          display: flex;
          flex-direction: column;
        }

        .logo-wrapper {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 2.5rem 2rem 2rem;
        }

        .logo-container {
          width: 48px;
          height: 48px;
          background: #ffffff;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 20px rgba(255, 255, 255, 0.2);
        }

        .logo-letter {
          color: #312e81; /* Deep indigo */
          font-size: 24px;
          font-weight: 900;
          letter-spacing: -1px;
        }

        .brand-name {
          color: white;
          font-size: 20px;
          font-weight: 800;
          letter-spacing: 1px;
        }

        .menu {
          padding: 0 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .menu-link {
          text-decoration: none;
        }

        .menu-item {
          height: 52px;
          width: 100%;
          border: none;
          background: transparent;
          color: #a1a1aa; /* Zinc-400 */
          text-align: left;
          padding: 0 1.5rem;
          border-radius: 16px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          font-weight: 600;
          font-size: 13px;
          letter-spacing: 0.5px;
          display: flex;
          align-items: center;
          gap: 1rem;
          cursor: pointer;
          position: relative;
          overflow: hidden;
        }

        .menu-label {
          position: relative;
          z-index: 10;
        }

        /* Hover Effect for Inactive Items */
        .menu-item:not(.active):hover {
          color: #ffffff;
          background: rgba(255, 255, 255, 0.05);
          transform: translateX(8px);
        }

        /* Active State */
        .menu-item.active {
          color: #ffffff;
          background: rgba(255, 255, 255, 0.1);
          box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .active-indicator {
          position: absolute;
          left: 0;
          top: 25%;
          bottom: 25%;
          width: 4px;
          background: #4f46e5; /* Indigo-600 */
          border-radius: 0 4px 4px 0;
          box-shadow: 0 0 12px rgba(79, 70, 229, 0.8);
        }

        .sidebar-footer {
          display: flex;
          gap: 1rem;
          padding: 2rem;
        }

        .footer-icon {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #a1a1aa;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .footer-icon:hover {
          color: #ffffff;
          background: rgba(255, 255, 255, 0.1);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(79, 70, 229, 0.2);
        }

        @media (max-width: 768px) {
          .sidebar {
            width: 100%;
            border-right: none;
            border-bottom: 1px solid rgba(255, 255, 255, 0.05);
            flex-direction: row;
            flex-wrap: wrap;
            padding: 0.75rem 1rem;
            align-items: center;
          }

          .sidebar-top {
            flex-direction: row;
            align-items: center;
            flex: 1;
          }

          .logo-wrapper {
            padding: 0;
            gap: 0.75rem;
          }
          
          .logo-container {
            width: 36px;
            height: 36px;
          }
          
          .logo-letter {
            font-size: 18px;
          }

          .brand-name {
            font-size: 16px;
          }

          .menu {
            flex-direction: row;
            flex-wrap: wrap;
            padding: 0;
            gap: 0.5rem;
            margin-left: auto;
            margin-right: 1rem;
          }
          
          .menu-item {
            height: 40px;
            padding: 0 1rem;
            width: auto;
          }
          
          .menu-item:not(.active):hover {
            transform: translateY(-2px);
          }
          
          .active-indicator {
            left: 15%;
            right: 15%;
            bottom: 0;
            top: auto;
            height: 3px;
            width: auto;
            border-radius: 4px 4px 0 0;
          }

          .sidebar-footer {
            padding: 0;
            gap: 0.75rem;
          }
        }
      `}</style>
    </aside>
  )
}
