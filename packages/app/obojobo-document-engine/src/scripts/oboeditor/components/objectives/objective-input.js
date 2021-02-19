import './objective-input.scss'
import React from 'react'
import Common from 'obojobo-document-engine/src/scripts/common'
import { v4 as uuidv4 } from 'uuid'

const { Button } = Common.components

class ObjectiveInput extends React.Component {
    constructor(props) {
		super(props)
		this.state = {
            editMode: false,
            objectiveID: uuidv4(),
            objectiveDescription: "",
            objectiveLetter: ""
        }
    }

    componentDidMount() {
        this.setState({
            objectiveDescription: this.props.description
        });
        this.setState({
            objectiveID: this.props.id
        });
        this.setState({
            objectiveLetter: this.props.letter
        });
    }
    
    sendData() {
        this.props.onUpdate(this.state.objectiveID, this.state.objectiveDescription);
        this.setState({ editMode: false });
    }

    render() {
        let {editMode} = this.state;
        let deleteButton = (
            <button
                className="delete-button"
                onClick={this.props.delete}
            >
                ×
            </button>
        )

        return (
            <div className="objective-input">
                <label className="label" htmlFor="objective">
                    {this.props.letter}
                </label>
                <div className="objective" name="objective">
                    {editMode ? (
                        <div className="edit-mode">
                            <textarea
                                className="input-item"
                                defaultValue={this.state.objectiveDescription}
                                onChange={e => this.setState({ objectiveDescription: e.target.value })}
                            />
                            <button className="edit-objective-id-button" onClick={() => alert("Don't do it!!")}>Edit objective ID</button>
                            {deleteButton}
                            <Button onClick={this.sendData.bind(this)}>Done</Button>
                        </div>
                    ) : (
                        <div className="read-mode">
                            <div 
                                onClick={() => this.setState({ editMode: true})}
                            >
                                {this.props.description}
                            </div>
                            {deleteButton}
                        </div>
                    )}
                </div>
            </div>
        )
    }
}

export default ObjectiveInput;