import smartpy as sp

TPerson = sp.TRecord(
    dose1 = sp.TBool,
    dose2 =  sp.TBool,
    dose1_timestamp = sp.TOption(sp.TTimestamp),
    dose2_timestamp = sp.TOption(sp.TTimestamp)
)

people_big_map = sp.big_map(
    l = {},
    tkey = sp.TNat,
    tvalue = TPerson
)

class VaccinationData(sp.Contract):
    def __init__(self):
        self.init(
            admin = sp.address('tz1dF4g213rhSRoBs8k1Gjx9N6zdVcPWMEQB'),
            people = people_big_map,
        )
    
    @sp.entry_point
    def register_person(self, params):
        self.is_admin()

        adhaar = params.adhaar
        self.check_person(adhaar, should_exist = False)

        self.data.people[adhaar] = sp.record(
            dose1 = False,
            dose2 = False,
            dose1_timestamp = sp.none,
            dose2_timestamp = sp.none
        )
    
    @sp.entry_point
    def mark_dose(self, params):
        sp.set_type(params.dose, sp.TNat)
        sp.set_type(params.adhaar, sp.TNat)

        self.is_admin()
        
        adhaar = params.adhaar
        self.check_person(adhaar)
        person = self.data.people.get(adhaar)
        
        dose = params.dose

        sp.if dose == 1:
            self.check_dose(person, 1, False)
            person.dose1 = True
            person.dose1_timestamp = sp.some(sp.now)
            print(person)
            self.data.people[adhaar] = person

        sp.if dose == 2:
            print("DOSE 2 DETECTED IN mark_dose")
            self.check_dose(person, 1, True)
            self.check_dose(person, 2, False)
            person.dose2 = True
            person.dose2_timestamp = sp.some(sp.now)
            self.data.people[adhaar] = person
    
    def check_dose(self, person, dose, should_exist):
        sp.set_type(person, TPerson)
        sp.set_type(dose, sp.TNat)

        sp.if dose == 1:
            sp.if should_exist == True:
                sp.verify(
                    person.dose1 == True,
                    message = "DOSE1_NOT_FOUND"
                )
                return
            sp.if should_exist == False:
                sp.verify(
                    person.dose1 == False,
                    message = "DOSE1_ALREADY_MARKED"
                )
                return
        sp.if dose == 2:
            sp.if should_exist == True:
                sp.verify(
                    person.dose2 == True,
                    message = "DOSE2_NOT_FOUND"
                )
                return
            sp.if should_exist == False:
                sp.verify(
                    person.dose2 == False,
                    message = "DOSE2_ALREADY_MARKED"
                )
                return
        
        sp.failwith('DOSE_NUMBER_NOT_VALID')
        return

    def check_person(self, id, should_exist = True):
        if should_exist == True:
            sp.verify(
                self.data.people.contains(
                    id,
                ),
                message = 'NOT_REGISTERED'
            )
            pass
        else:
            sp.verify_equal(
                self.data.people.contains(
                    id,
                ),
                False,
                message = 'ALREADY_REGISTERED'
            )
            pass

    def is_admin(self):
        sp.verify_equal(self.data.admin, sp.sender, message = 'NOT_ADMIN')


@sp.add_test(name = "MyContract")
def test():
    contract = VaccinationData()
    scenario = sp.test_scenario()

    scenario += contract
    scenario += contract.register_person(
       adhaar = 1
    ).run(
        sender = sp.address("tz1dF4g213rhSRoBs8k1Gjx9N6zdVcPWMEQB"),
    )

    scenario += contract.register_person(
        adhaar =  1
    ).run(
        sender = sp.address("tz1dF4g213rhSRoBs8k1Gjx9N6zdVcPWMEQB"),
        valid  = False
    )

    scenario += contract.mark_dose(
        adhaar = 1,
        dose = 2
    ).run(
        sender = sp.address("tz1dF4g213rhSRoBs8k1Gjx9N6zdVcPWMEQB"),
        valid = False
    )

    scenario += contract.mark_dose(
        adhaar = 1,
        dose = 1
    ).run(
        sender = sp.address("tz1dF4g213rhSRoBs8k1Gjx9N6zdVcPWMEQB"),
        now = sp.timestamp_from_utc_now()
    )
    scenario += contract.mark_dose(
        adhaar = 1,
        dose = 2
    ).run(
        sender = sp.address("tz1dF4g213rhSRoBs8k1Gjx9N6zdVcPWMEQB"),
        now = sp.timestamp_from_utc_now()
    )