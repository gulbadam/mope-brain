import React from 'react';
import Colors from "../Colors/Colors";
import General from "../General/General";
import Demographics from "../Demographics/Demographics";
import {
    Tabs,
   Tab
} from 'react-bootstrap';
const initialState = {
    key: 1,
        colors: [],
        age: [],
        gender: [],
        culture: [],
        message: '',
        general: [],
};
class ControlledTabs extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.handleSelect = this.handleSelect.bind(this);
        this.state = initialState;
    }

    handleResultsColors = (data) => {
        return data.outputs[0].data.colors.map(color => {
            const raw_hex = color.raw_hex;
            const name = color.w3c.name;
            const hex =color.w3c.hex;
            const value =  Math.floor(color.value *100);
        return {
        raw_hex: raw_hex,
        name: name,
        hex: hex,
        value: value
        };
})
}
    handleColors = (colors) => {
        this.setState({colors: colors});
};
handleResultsMulticultural =(data) => {
    return data.outputs[0].data.regions[0].data.face.multicultural_appearance.concepts.map(culture => {
        const id = culture.id;
        const name= culture.name;
        const value= Math.floor(culture.value *100);
        return {
            id: id,
            name: name,
            value: value
        };
    })
};
handleCulture=(culture)=>{
    this.setState({culture: culture});
    }
handleResultGender =(data)=>{
    return data.outputs[0].data.regions[0].data.face.gender_appearance.concepts.map(gender =>{
        const id = gender.id;
        const name = gender.name;
        const value =Math.floor(gender.value *100);
        return {
            id : id,
            name: name,
            value: value
            };
    })
}
handleGender = (gender) =>{
    this.setState({gender: gender});
};
handeleResultsAge=(data)=>{
    return data.outputs[0].data.regions[0].data.face.age_appearance.concepts.map(age => {
        const id = age.id;
        const name = age.name;
        const value = Math.floor(age.value*100);
        return {
            id: id,
            name: name,
            value: value
        }
    })
}
handleAge =(age)=>{
    this.setState({age: age});
}
handleResultsGeneral=(data)=>{
return data.outputs[0].data.concepts.map(general => {
const id = general.id;
const name = general.name;
const value = Math.floor(general.value *100);
return {
    id: id,
    name: name,
    value: value
}
})
}
handleGeneral=(general)=>{
    this.setState({general: general});
}
componentDidMount() {
        this.handleSelect(this.state.key)
        }
componentDidUpdate(prevProps, prevState) {
if (this.props.input !== prevProps.input) {
    this.handleSelect(this.state.key);
}
}
        handleSelect(key) {
        this.setState({key});
        switch (key) {
        case 1:
            fetch('/general', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        input: this.props.input
                    })
                })
                .then(response => response.json())
                .then(response => {
                this.handleGeneral(this.handleResultsGeneral(response))
                })
                .catch(err => console.log(err));
        
        break;
        case 2:
    fetch('/colors', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                input: this.props.input
            })
        })
        .then(response => response.json())
        .then(response => {
            this.handleColors(this.handleResultsColors(response))
        })
        .catch(err => console.log(err));
        break;
            case 3:
    fetch('/demographics', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                input: this.props.input
            })
        })
        .then(response => response.json())
        .then(response => {
            if (response.outputs[0].data.regions) {
            this.handleCulture(this.handleResultsMulticultural(response));
            this.handleGender(this.handleResultGender(response));
            this.handleAge(this.handeleResultsAge(response));
            } else  {
                const msg = "No faces detected";
              
                this.setState({message: msg});
            }
        })
        .catch(err => console.log(err));
            break;
            default:
            fetch('/general', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        input: this.props.input
                    })
                })
                .then(response => response.json())
                .then(response => {
                    this.handleGeneral(this.handleResultsGeneral(response))
                })
                .catch(err => console.log(err));
            break;
        }
    }

render() {
    const {colors, general, gender,  culture} = this.state;
    return (
        <div className="center ma mt3">
            <Tabs
        defaultActiveKey = {1}
                onSelect={this.handleSelect}
                colors={colors}
                general={general}
                gender={gender}
                culture={culture}
                id="controlled-tab-example">
                <Tab eventKey={1} general={general} title="General">
                    <div>
                        {(general.length >1 ?
                        <General general ={general}/>:
                    <div></div>)}
                    </div >
                </Tab>
                <Tab eventKey={2} title="Colors">
                {(colors.length > 1) ?
                    <Colors colors = {colors}/> :
                    <div> </div>
                }
                </Tab>
            <Tab eventKey={3} culture={culture}  gender={gender} title="Demographics">
                    {(culture.length>1)?
                    <Demographics culture={culture}  gender={gender}/>:
                    <div wait={1000}><h5>No faces detected</h5> </div>
                }
                </Tab>
            </Tabs>
    </div>
    );
}
}
export default ControlledTabs;