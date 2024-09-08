
// react component



export function SolutionCard(props: { content: any }) {

    return (
        <div className="border mg_border_blue mr-top-10" style={{
            boxShadow: '0 0 10px 0 rgba(0, 0, 0, 0.1)',
        }}>
  {/* title */}
  <div className="w-16 h-16 text-2xl font-bold my_bg_blue" 
        style={{
            padding: '1rem',
        }}
    >
    {props.content.Function}
  </div>

  {/* left and right box */}
  <div className="flex mt-4 p-4">
    {/* left box: image */}
    <div className="w-[512px]">
      {props.content.image_name ? (
        <img src={`./${props.content.image_name}.png`} alt="solution" className="w-[512px]" />
      ) : (
        <img src="https://via.placeholder.com/512" alt="solution" className="w-[512px]" />
      )}
    </div>

    {/* right box */}
    <div className="flex-1 ml-6" style={{
        marginLeft: '1.5rem',
    }}>
      {/* Function */}
      <div className="mb-6">
        <p className="text-xl font-bold">Function</p>
        <p>{props.content.Function}</p>
      </div>

      {/* Use Case */}
      <div className="mb-6 ">
        <p className="text-xl font-bold mr-top-5">Use Case</p>
        <p>{props.content['Use Case']}</p>
      </div>

      {/* tech method */}
        <div className="mb-6">
            <p className="text-xl font-bold mr-top-5">Technical Method</p>
            <p>{props.content['Technical Method']['Original']}</p>
            <div className="flex my_bg_yellow2">
                <div style={{width: '18px', height: 'inherit'}} className="my_bg_yellow"></div>
                <p style={{marginLeft: '5px', padding: '5px'}}>
                    <span className="text-gray-500 font-bold">Performance:</span>
                    <span className="ml-2">{props.content['Possible Results']['Original']['Performance']}</span>
                </p>
            </div>
            <div className="flex my_bg_yellow2" style={{marginTop: '5px'}}>
                <div style={{width: '18px', height: 'inherit'}} className="my_bg_yellow"></div>
                <p style={{marginLeft: '5px', padding: '5px'}}>
                    <span className="text-gray-500 font-bold">User Experience:</span>
                    <span className="ml-2">{props.content['Possible Results']['Original']['User Experience']}</span>
                </p>
            </div>
        </div>

      {/* Unique */}
      <div className="mb-6">
        <p className="text-xl font-bold mr-top-5">Evaluation Score</p>
        <div className="flex items-center">
          {/* 7-level progress bar */}
          <div className="flex space-x-1">
            {[...Array(7)].map((_, index) => (
              <div
                key={index}
                className={`w-8 h-4 ${
                  index < props.content['Evaluation_Result']['score']
                    ? 'my_bg_yellow'
                    : 'bg-gray-300'
                }`}
                style={{
                    width: '3.5rem',
                    height: '1rem',
                    border: '1px solid #cccs',
                }}
              />
            ))}
          </div>
          <span className="ml-2 text-gray-700">
            {props.content['Evaluation_Result']['score']}/7
          </span>
        </div>
      </div>
    </div>
  </div>
</div>

    )
}