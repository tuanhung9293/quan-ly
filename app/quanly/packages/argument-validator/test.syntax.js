
call_action('')
  .input()
  .output({
    ok: true,
    warehouse: is_entity().contains(input).has('id')
  })
  .exception({
    name: 'ValidationException',
    rule: 'required',
    argument: 'test',
    intlMessageId: 'role:warehouse,cmd:add / argument:test / ValidationException:required'
  })
  .next(function() {
    call_action()
      .input()
      .output()
  })
  .end(done)
  