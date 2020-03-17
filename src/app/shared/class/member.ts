export class Member {
    constructor(
        public MemberID: number,
        public FirstName: string,
        public LastName: string,
        public Roles: Role[]
    ) {}
}

export class Role {
    constructor(
        public RoleID: number,
    ) {}
}
