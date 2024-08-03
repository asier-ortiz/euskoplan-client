// src/font-awesome.js

import { library } from '@fortawesome/fontawesome-svg-core';
import { faTh, faMap, faFilter, faHeart, faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { faLaravel, faVuejs } from '@fortawesome/free-brands-svg-icons'; // Importa los íconos de Laravel y Vue
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

library.add(faTh, faMap, faFilter, faHeart, faLaravel, faVuejs, faLocationDot);

export { FontAwesomeIcon };
