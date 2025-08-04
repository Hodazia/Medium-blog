import z from "zod"

// ensure the data is  validated before it is sent to the DB
export const signupInput = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    name: z.string().optional()
})

export const signinInput = z.object({
    email: z.string().email(),
    password: z.string().min(6)
})


export const createBlogInput = z.object({
    title:   z.string(),
    content: z.string()
})

export const updateBlogInput = z.object({
    title:   z.string(),
    content: z.string()
})


