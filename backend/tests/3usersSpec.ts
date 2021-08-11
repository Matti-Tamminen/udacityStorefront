import User from "../src/models/users"

const users = new User()

describe('Testing users', () => {
    it('required functions to be defined', () => {
        expect(users.createUser).toBeDefined()
        expect(users.readOneUser).toBeDefined()
        expect(users.readAllUsers).toBeDefined()
        expect(users.safeUsers).toBeDefined()
        expect(users.authenticate).toBeDefined()
        expect(users.deleteOneUser).toBeDefined()
    })

    it('createUser creates entry', async () => {
        const res = await users.createUser('matti', 'tamminen', 'mattam', 'password')
        const res2 = await users.createUser(null, 'testing', 'test', 'secret')
        const res3 = await users.createUser('test', 'person', 'tepe', 'example')

        expect(res.last_name).toEqual('tamminen')
        expect(res2.first_name).toBeNull()
        expect(res3.password.length).toBeGreaterThan(7)
    })

    it('readUsers to find right users', async () => {
        const res = await users.readAllUsers()
        const res2 = await users.readOneUser(res[0].id)
        const res3 = await users.safeUsers()

        expect(res.length).toBeGreaterThan(1)
        expect(res2.id).toEqual(res[0].id)
        expect(res3[0]).not.toContain('password')
    })

    it('authenticate passes and fails depending on credentials', async () => {
        const res = await users.readAllUsers()
        let pass: string
        if (res[0].username == 'mattam') {
            pass = 'password'
        } else if (res[0].username == 'test') {
            pass = 'secret'
        } else {
            pass = 'example'
        }
        const res2 = await users.authenticate(res[0].username, pass)

        expect(res2).not.toBeFalsy()
        try {
            expect(await users.authenticate(res[0].username, 'nicetry')).toThrowError(Error)
        } catch (err) {
            console.log(`Test produces expected Error 1: ${err}`)
        }
        try {
            expect(await users.authenticate('maybethis', res[0].password)).toThrowError(Error)
        } catch (err) {
            console.log(`Test produces expected Error 2: ${err}`)
        }
    })
})