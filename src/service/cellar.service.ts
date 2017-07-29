/**
 * Created by loicsalou on 28.02.17.
 */

import {Locker} from '../model/locker';

/**
 * Services related to the cellar itself, locker and place of the lockers.
 * The subregion_label below are duplicated in the code of france.component.html as they are emitted when end-user
 * clicks on a region to filter lockers. Any change on either side must be propagated on the other side.
 */
export interface CellarService {

  fetchAllLockers():void;

  createLocker(locker: Locker): void;

  replaceLocker(locker: Locker): void;

  deleteLocker(locker: Locker): void;

}


