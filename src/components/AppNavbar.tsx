import { IonHeader, IonIcon, IonToolbar } from '@ionic/react';
import { informationCircleOutline, peopleOutline, personAddOutline } from 'ionicons/icons';
import { NavLink } from 'react-router-dom';

import './AppNavbar.css';

interface NavItem {
  to: string;
  label: string;
  icon: string;
}

const NAV_ITEMS: NavItem[] = [
  { to: '/clientes', label: 'Ver clientes', icon: peopleOutline },
  { to: '/clientes/nuevo', label: 'Añadir cliente', icon: personAddOutline },
  { to: '/about', label: 'About', icon: informationCircleOutline },
];

/**
 * Top navigation shared by every page. Ionic keeps the header pinned above the
 * scrolling content, and NavLink marks the current route with `.is-active` and
 * `aria-current="page"`.
 */
const AppNavbar: React.FC = () => (
  <IonHeader className="app-header" translucent={false}>
    <IonToolbar className="app-toolbar">
      <div className="app-nav">
        <NavLink className="brand" to="/clientes" aria-label="Clientes App, ir a la lista de clientes">
          <span className="brand-mark" aria-hidden="true">
            C
          </span>
          <span className="brand-name">
            Clientes <span className="brand-suffix">App</span>
          </span>
        </NavLink>

        <nav className="app-nav-links" aria-label="Navegación principal">
          <ul className="nav-list">
            {NAV_ITEMS.map((item) => (
              <li key={item.to}>
                <NavLink
                  className={({ isActive }) => `nav-link${isActive ? ' is-active' : ''}`}
                  to={item.to}
                  end
                  aria-label={item.label}
                  title={item.label}
                >
                  <IonIcon className="nav-icon" icon={item.icon} aria-hidden="true" />
                  <span className="nav-label">{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </IonToolbar>
  </IonHeader>
);

export default AppNavbar;
