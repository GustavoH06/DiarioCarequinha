import { BsList } from 'react-icons/bs';
import { Link, useNavigate } from 'react-router';
import classNames from 'classnames';
import { useState, useRef, useEffect } from 'react';

const Navbar = () => {
    const [showNav,     setShowNav]     = useState(false);
    const [addDropdown, setAddDropdown] = useState(false);
    const dropdownRef = useRef(null);
    const navigate    = useNavigate();

    const items = [
        { routerLink: '/home',       icon: 'bi bi-house',    label: 'Home'         },
        { routerLink: '/aluno-list', icon: 'bi bi-person',   label: 'Listar Alunos'},
        { routerLink: '/sala-list',  icon: 'bi bi-display',  label: 'Listar Salas' },
    ];

    useEffect(() => {
        function handleClick(e) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setAddDropdown(false);
            }
        }
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    return (
        <div className={showNav ? 'sidenav active' : 'sidenav'}>
            <div className="sidenav-nav">
                <li className="sidenav-nav-item" onClick={() => setShowNav(!showNav)}>
                    <div className="sidenav-nav-link">
                        <BsList />
                    </div>
                </li>

                {items.map(item => (
                    <li key={item.label} className="sidenav-nav-item">
                        <Link className="sidenav-nav-link" to={item.routerLink}>
                            <i className={classNames({ 'sidenav-link-icon': true, [item.icon]: true })} />
                            {showNav && <span className="sidenav-link-text">{item.label}</span>}
                        </Link>
                    </li>
                ))}

                <li className="sidenav-nav-item" ref={dropdownRef} style={{ position: 'relative' }}>
                    <div
                        className="sidenav-nav-link"
                        onClick={() => setAddDropdown(o => !o)}
                        style={{ cursor: 'pointer' }}
                    >
                        <i className={classNames({ 'sidenav-link-icon': true, 'bi': true, 'bi-plus-circle': true })} />
                        {showNav && <span className="sidenav-link-text">Adicionar</span>}
                    </div>

                    {addDropdown && (
                        <ul className="sidenav-dropdown">
                            <li onClick={() => { navigate('/aluno-form'); setAddDropdown(false); }}>
                                <i className="bi bi-person-plus" />
                                <span>Aluno</span>
                            </li>
                            <li onClick={() => { navigate('/sala-form'); setAddDropdown(false); }}>
                                <i className="bi bi-display" />
                                <span>Sala</span>
                            </li>
                        </ul>
                    )}
                </li>

            </div>
        </div>
    );
};

export default Navbar;
