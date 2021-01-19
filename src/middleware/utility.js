const handleMissing = (missingList, obj) => {
  if (!obj) return 'No body!'
  if (!missingList) return
  let missing = [];
  missingList.forEach(ele => {
    if (!(ele in obj)) missing.push(ele)
  })
  if (missing.length === 0) return null
  else return missing.join(', ').concat(' missing!')
}

module.exports = handleMissing;