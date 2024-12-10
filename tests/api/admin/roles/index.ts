import create          from './create';
import show            from './show';
import list            from './list';
import update          from './update';
import deleteRole      from './delete';
import listPermissions from './listPermissions';

export default [
    ...create,
    ...show,
    ...list,
    ...update,
    ...deleteRole,
    ...listPermissions
];
