/// <reference path="../../typings/index.d.ts"/>
import { JsonProperty, JsonPropertyDecoratorMetadata, AccessType } from "../main/DecoratorMetadata";
import { ObjectMapper } from "../main/index";
import { a, b } from "./NameSpaces";


describe("Testing deserialize functions", () => {

    it("Testing Class type with no annotations and 0 children", () => {
        class NameTypeWithoutAnnotations {
            firstName: string = undefined;
            lastName: string = undefined;
            middleName: string = undefined;

            public getFirstName(): string {
                return this.firstName;
            }
        }
        var nameTypeWithoutAnnotationsJson = { firstName: 'John', middleName: 'P', lastName: 'Doe' };

        var processedDto: NameTypeWithoutAnnotations = ObjectMapper.deserialize(NameTypeWithoutAnnotations, nameTypeWithoutAnnotationsJson);
        expect(processedDto.getFirstName()).toBe('John');
        expect(processedDto.middleName).toBe('P');
        expect(processedDto.lastName).toBe('Doe');

    });

});


describe("Testing serialize functions", () => {
    it("Testing Class type with no annotations and 0 children", () => {

        var SimpleClassJson = {
            firstName: "John",
            middleName: "P",
            lastName: "Doe"
        };

        let stringrified: String = ObjectMapper.serialize(SimpleClassJson);
        // console.log(JSON.stringify(SimpleClassJson));
        expect(stringrified).toBe('{"firstName":"John","middleName":"P","lastName":"Doe"}');

    });

    it("Testing Class type with no annotations and an array", () => {

        class SimpleClass {
            firstName: string = "John";
            middleName: string = "P";
            lastName: string = "Doe";
            @JsonProperty({ type: String, name: "AKA" })
            knownAs: String[] = ["John", "Doe", "JohnDoe", "JohnPDoe"]
        };

        let intance: SimpleClass = new SimpleClass();

        let stringrified: String = ObjectMapper.serialize(intance);
        expect(stringrified).toBe('{"firstName":"John","middleName":"P","lastName":"Doe","AKA":["John","Doe","JohnDoe","JohnPDoe"]}');

    });

    it("Test all simple type properties", () => {
        class SimpleRoster {
            private name: String = undefined;
            private worksOnWeekend: Boolean = undefined;
            private numberOfHours: Number = undefined;
            @JsonProperty({type:Date})
            private systemDate: Date = undefined;

            public isAvailableToday(): Boolean {
                if (this.systemDate.getDay() % 6 == 0 && this.worksOnWeekend == false) {
                    return false;
                }
                return true;
            }

        }
        let json = {
            'name': 'John Doe',
            'worksOnWeekend' : false,
            'numberOfHours': 8,
            'systemDate' : 1483142400000 // Sat Dec 31, 2016
        };

        let testInstance: SimpleRoster = ObjectMapper.deserialize(SimpleRoster, json);
        expect(testInstance.isAvailableToday()).toBeFalsy();

    });


});

describe("Testing NameSpaces", () => {
    it("Test 1", () => {

        let random1 = Math.random();
        let random2 = Date.now();

        var json = {
            "c": "This is a test",
            "d": {
                "f": random1,
                "t": random2
            }
        };


        let testInstance = ObjectMapper.deserialize(b.NamespaceBClass, json);
        expect(testInstance.d.f).toBe(random1);
        expect(testInstance.d.t).toBe(random2);
    });
});

describe("Misc tests", () => {
    it("Tesing Dto with functions", () => {
        class Roster {
            private name: string = undefined;
            private worksOnWeekend: boolean = false;
            private today: Date = new Date();
            public isAvailable(date: Date): boolean {
                if (date.getDay() % 6 == 0 && this.worksOnWeekend == false) {
                    return false;
                }
                return true;
            }
            public isAvailableToday(): boolean {
                return this.isAvailable(this.today);
            }
        }

        var json = {
            'name': 'John Doe',
            'worksOnWeekend': false
        }

        var testInstance: Roster = ObjectMapper.deserialize(Roster, json);
        expect(testInstance.isAvailable(new Date("2016-12-17"))).toBeFalsy();
        expect(testInstance.isAvailable(new Date("2016-12-16"))).toBeTruthy();
        expect(testInstance.isAvailableToday()).toBe(((new Date()).getDay() % 6 == 0) ? false : true);

    });

    it("Testing enum ", () => {
        enum Days{
            Sun, Mon, Tues, Wed, Thurs, Fri, Sat
        }  

        class Workday{
            @JsonProperty({type: Days})
            today: Days = undefined;
        }        

        let json = { "today": 2 };
        
        let testInstance: Workday = ObjectMapper.deserialize(Workday, json);
        expect(testInstance.today == Days.Tues).toBeTruthy();
        testInstance.today = Days.Fri;
        let serialized: String = ObjectMapper.serialize(testInstance);
        expect(serialized).toBe('{"today":5}');
    });

});