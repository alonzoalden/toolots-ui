export class Member {
    constructor(
        public MemberID: number,
        public EmployeeID: string,
        public FirstName: string,
        public LastName: string,
        public Email: string,
        public ProfileImagePath: string,
        public IsActive: string,

        public MemberRoles: Role[]
    ) {}
}

export class Role {
    constructor(
        public MemberGadgetRoleID: number,
        public GadgetRoleID: string,
        public GadgetRoleName: string,

    ) {}
}
