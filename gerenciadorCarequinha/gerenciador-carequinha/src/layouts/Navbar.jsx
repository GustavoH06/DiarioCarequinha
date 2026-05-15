import { BsList, BsHouse, BsPerson, BsDisplay } from 'react-icons/bs';
import { Link } from 'react-router';
import classNames from 'classnames';
import { useState } from 'react';



const Navbar = () => {
    

    const items = [
        /*{
            routerLink: "/",
            icon: "bi bi-list",
            label: "index"
        },*/

        {
            routerLink: "/home",
            icon: "bi bi-house",
            label: "Home"
        },

        {
            routerLink: "/aluno-list",
            icon: "bi bi-person",
            label: "Listar Alunos"
        },

        {
            routerLink: "/sala-list",
            icon: "bi bi-display",
            label: "Listar Salas"
        },
        {
            routerLink: "/criar",
            icon: "bi bi-plus-circle",
            label: "Adicionar"
        },
    ];

    
    const [showNav, setShowNav] = useState(false);
    
    return(
        <div className={showNav ? "sidenav active" : "sidenav"}>
            
            <div className="sidenav-nav">
                <li className="sidenav-nav-item" onClick={() => setShowNav(!showNav)}>
                    <div className="sidenav-nav-link">
                        <BsList />
                    </div>
                </li>

                {items.map(item => (
                    <li key={item.label} className='sidenav-nav-item'>
                        <Link className="sidenav-nav-link" to={item.routerLink}>
                            <i 
                                className={classNames({
                                    "sidenav-link-icon": true,
                                    [item.icon]: true,
                                })}
                            >
                            </i>
                            {showNav && <span className='sidenav-link-text'>{item.label}</span>}
                        </Link>
                    </li>
                ))}
            </div>
        </div>
    )
}

export default Navbar