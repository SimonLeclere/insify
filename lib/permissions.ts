import { createAccessControl } from "better-auth/plugins/access";
import { defaultStatements, adminAc, ownerAc, memberAc } from 'better-auth/plugins/organization/access'

const statement = {
    ...defaultStatements,
    project: ["create", "update", "delete", "export"],
} as const;

export const ac = createAccessControl(statement);

export const owner = ac.newRole({
    ...ownerAc.statements,
    project: ["create", "update", "delete"],
});

export const admin = ac.newRole({
    ...adminAc.statements,
    project: ["create", "update", "delete"],
});

export const member = ac.newRole({
    ...memberAc.statements,
    project: ["update"],
});