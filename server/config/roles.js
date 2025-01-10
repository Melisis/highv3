const AccessControl = require('accesscontrol');

const allRights = {
    'create:any':['*'],
    'read:any':['*'],
    'update:any':['*'],
    'delete:any':['*']
}

let grantsObject = {
    admin: {
        profile: allRights
    },
    user: {
        profile: {
            'read:own': ['*', '!password', '!_id'], // 'password' ve '_id' hariç
            'update:own': ['*']
        }
    }
};

const roles = new AccessControl(grantsObject)

module.exports = { roles }