import sessions from './sessions';
import roles    from './roles';
import users    from './users';
import admins   from './admins';

export default [
    ...sessions,
    ...roles,
    ...users,
    ...admins
];
