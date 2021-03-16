import React from 'react'

export default function Ideas(props) {
    return (
        <div className="masonry-with-columns">
            {
                props.state.context.ideas.map(idea => 
                    <div className="masonry-brick">
                        <div className="name">{idea.name}</div>
                        <div className="goal">{idea.goal}</div>
                    </div>
                )
            }
        </div>
    )
}
