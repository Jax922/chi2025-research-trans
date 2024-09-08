


// react component
function QAItemTargetUser(props: { content: string }) {
  const { content } = props;
  return (
    <p>
        <span className="text-gray-500 font-bold">TARGET USER:</span>
        <span className="ml-2">{content}</span>
    </p>
  )
}

function QAItemUserScenario(props: { content: string }) {
  const { content } = props;
  return (
    <p>
        <span className="text-gray-500 font-bold">USAGE SCENARIO:</span>
        <span className="ml-2">{content}</span>
    </p>
  )
}

function QAItemRequirment(props: { content: any }) {
  const { content } = props;
  const contentStr = content.join(', ');
  return (
    <p>
        <span className="text-gray-500 font-bold">REQUIREMENTS:</span>
        <span className="ml-2">{contentStr}</span>
    </p>
  )
}

export function QAItem(props: { content: string }) {
    const contentObj = JSON.parse(props.content);
    console.log(contentObj);
    const targetUser = contentObj['Targeted User'];
    const userScenario = contentObj['Usage Scenario'];
    const requirements = contentObj['Requirement'];
    return (
        <div className="p-4 bg-gray-100 rounded-lg">
            <QAItemTargetUser content={targetUser} />
            <br />
            <QAItemUserScenario content={userScenario} />
            <br />
            <QAItemRequirment content={requirements} />
        </div>
    )
}
