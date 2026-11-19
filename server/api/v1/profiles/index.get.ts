/** GET /api/v1/profiles: the signed-in person's profile. */
export default defineEventHandler(async (event) => {
  const user = await requireUser(event)
  return getProfile(serverSupabase(event), user.id)
})
